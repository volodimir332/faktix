import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Ініціалізація Firebase Admin
admin.initializeApp();

// Ініціалізація Stripe
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-10-16',
});

const db = admin.firestore();

// Типи для підписок
interface SubscriptionData {
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  priceId: string;
  planName: string;
}

// 1.1. Функція для створення сесії оплати
export const createStripeCheckoutSession = functions.https.onCall(async (data, context) => {
  try {
    // Перевірка автентифікації
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Користувач не авторизований');
    }

    const { priceId, successUrl, cancelUrl } = data;
    const userId = context.auth.uid;

    if (!priceId) {
      throw new functions.https.HttpsError('invalid-argument', 'Price ID обов\'язковий');
    }

    console.log(`🔐 Creating checkout session for user: ${userId}, price: ${priceId}`);

    // Отримуємо дані користувача
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Користувача не знайдено');
    }

    const userData = userDoc.data();
    let stripeCustomerId = userData?.stripeCustomerId;

    // Якщо у користувача немає Stripe Customer ID, створюємо нового
    if (!stripeCustomerId) {
      console.log(`👤 Creating new Stripe customer for user: ${userId}`);
      
      const customer = await stripe.customers.create({
        email: userData?.email,
        metadata: {
          firebase_user_id: userId
        }
      });

      stripeCustomerId = customer.id;

      // Зберігаємо Stripe Customer ID в Firestore
      await db.collection('users').doc(userId).update({
        stripeCustomerId: stripeCustomerId
      });

      console.log(`✅ Stripe customer created: ${stripeCustomerId}`);
    }

    // Створюємо Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14, // 14 днів безкоштовного періоду
        metadata: {
          firebase_user_id: userId
        }
      },
      success_url: successUrl || `${functions.config().app.url}/dashboard?success=true`,
      cancel_url: cancelUrl || `${functions.config().app.url}/pricing?canceled=true`,
      metadata: {
        firebase_user_id: userId
      }
    });

    console.log(`✅ Checkout session created: ${session.id}`);

    return {
      sessionId: session.id,
      url: session.url
    };

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', 'Помилка створення сесії оплати');
  }
});

// 1.2. Webhook для обробки подій Stripe
export const stripeWebhookHandler = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    // Перевіряємо підпис події
    event = stripe.webhooks.constructEvent(req.rawBody, sig as string, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).send(`Webhook Error: ${errorMessage}`);
    return;
  }

  console.log(`📡 Processing Stripe event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).send('Webhook processing failed');
  }
});

// 1.3. Функція для створення порталу клієнта
export const createStripePortalSession = functions.https.onCall(async (data, context) => {
  try {
    // Перевірка автентифікації
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Користувач не авторизований');
    }

    const userId = context.auth.uid;
    const { returnUrl } = data;

    console.log(`🔐 Creating portal session for user: ${userId}`);

    // Отримуємо дані користувача
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Користувача не знайдено');
    }

    const userData = userDoc.data();
    const stripeCustomerId = userData?.stripeCustomerId;

    if (!stripeCustomerId) {
      throw new functions.https.HttpsError('not-found', 'Stripe Customer не знайдено');
    }

    // Створюємо сесію порталу
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl || `${functions.config().app.url}/dashboard`,
    });

    console.log(`✅ Portal session created: ${session.id}`);

    return {
      url: session.url
    };

  } catch (error) {
    console.error('❌ Error creating portal session:', error);
    throw new functions.https.HttpsError('internal', 'Помилка створення порталу');
  }
});

// Обробники подій Stripe
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log(`✅ Checkout completed for session: ${session.id}`);

  if (!session.subscription || !session.customer) {
    console.error('❌ Missing subscription or customer data');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const customerId = session.customer as string;

  // Знаходимо користувача за Stripe Customer ID
  const userQuery = await db.collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (userQuery.empty) {
    console.error(`❌ User not found for Stripe customer: ${customerId}`);
    return;
  }

  const userDoc = userQuery.docs[0];
  const userId = userDoc.id;

  // Оновлюємо дані підписки в Firestore
  const subscriptionData: SubscriptionData = {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    status: subscription.status as SubscriptionData['status'],
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
    priceId: subscription.items.data[0].price.id,
    planName: subscription.items.data[0].price.nickname || 'Unknown Plan'
  };

  await db.collection('users').doc(userId).update({
    subscription: subscriptionData,
    subscriptionStatus: subscription.status,
    subscriptionEndDate: new Date(subscription.current_period_end * 1000),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log(`✅ Subscription data updated for user: ${userId}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`✅ Payment succeeded for invoice: ${invoice.id}`);

  if (!invoice.subscription || !invoice.customer) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const customerId = invoice.customer as string;

  // Знаходимо користувача
  const userQuery = await db.collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (userQuery.empty) {
    console.error(`❌ User not found for Stripe customer: ${customerId}`);
    return;
  }

  const userDoc = userQuery.docs[0];
  const userId = userDoc.id;

  // Оновлюємо дату закінчення підписки
  await db.collection('users').doc(userId).update({
    subscriptionStatus: subscription.status,
    subscriptionEndDate: new Date(subscription.current_period_end * 1000),
    lastPaymentDate: new Date(invoice.created * 1000),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log(`✅ Payment data updated for user: ${userId}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`❌ Payment failed for invoice: ${invoice.id}`);

  if (!invoice.subscription || !invoice.customer) {
    return;
  }

  const customerId = invoice.customer as string;

  // Знаходимо користувача
  const userQuery = await db.collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (userQuery.empty) {
    console.error(`❌ User not found for Stripe customer: ${customerId}`);
    return;
  }

  const userDoc = userQuery.docs[0];
  const userId = userDoc.id;

  // Оновлюємо статус підписки
  await db.collection('users').doc(userId).update({
    subscriptionStatus: 'past_due',
    lastPaymentFailure: new Date(invoice.created * 1000),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log(`✅ Payment failure recorded for user: ${userId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`🗑️ Subscription deleted: ${subscription.id}`);

  const customerId = subscription.customer as string;

  // Знаходимо користувача
  const userQuery = await db.collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (userQuery.empty) {
    console.error(`❌ User not found for Stripe customer: ${customerId}`);
    return;
  }

  const userDoc = userQuery.docs[0];
  const userId = userDoc.id;

  // Оновлюємо статус підписки
  await db.collection('users').doc(userId).update({
    subscriptionStatus: 'canceled',
    subscriptionCanceledAt: new Date(subscription.canceled_at! * 1000),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log(`✅ Subscription cancellation recorded for user: ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`🔄 Subscription updated: ${subscription.id}`);

  const customerId = subscription.customer as string;

  // Знаходимо користувача
  const userQuery = await db.collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (userQuery.empty) {
    console.error(`❌ User not found for Stripe customer: ${customerId}`);
    return;
  }

  const userDoc = userQuery.docs[0];
  const userId = userDoc.id;

  // Оновлюємо дані підписки
  const subscriptionData: SubscriptionData = {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    status: subscription.status as SubscriptionData['status'],
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
    priceId: subscription.items.data[0].price.id,
    planName: subscription.items.data[0].price.nickname || 'Unknown Plan'
  };

  await db.collection('users').doc(userId).update({
    subscription: subscriptionData,
    subscriptionStatus: subscription.status,
    subscriptionEndDate: new Date(subscription.current_period_end * 1000),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log(`✅ Subscription data updated for user: ${userId}`);
}
