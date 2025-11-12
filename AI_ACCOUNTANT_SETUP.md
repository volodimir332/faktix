# 🤖 AI-Бухгалтер - Інструкція з налаштування

## 🎯 Що було створено

Повнофункціональний AI-бухгалтер для чеської податкової системи з:

✅ **Knowledge Base система** - зберігання офіційних документів  
✅ **RAG (Retrieval Augmented Generation)** - розумний пошук + AI  
✅ **Web Scraper** - автоматичне завантаження з офіційних сайтів  
✅ **Чат-інтерфейс** - красивий UI з історією розмов  
✅ **Білінгвальність** - українська + чеська мова  
✅ **Персоналізація** - враховує дані користувача (фактури, профіль)  
✅ **18 тестових питань** - для перевірки якості  

---

## 🚀 Швидкий старт (5 хвилин)

### Крок 1: Налаштування API ключів

Створіть файл `.env.local` в папці `faktury/`:

```bash
# DeepSeek API (рекомендовано - дешевше і швидше)
DEEPSEEK_API_KEY=sk-ваш_ключ_тут

# OpenAI API (для embeddings, обов'язково!)
OPENAI_API_KEY=sk-ваш_ключ_тут
```

**Де отримати ключі:**

1. **DeepSeek**: https://platform.deepseek.com
   - Зареєструйтесь
   - API Keys → Create new key
   - Скопіюйте ключ

2. **OpenAI**: https://platform.openai.com/api-keys
   - Зареєструйтесь
   - Create new secret key
   - Скопіюйте ключ

### Крок 2: Запуск dev server

```bash
cd faktury
npm run dev
```

Server запуститься на `http://localhost:3000`

### Крок 3: Завантаження базової Knowledge Base

**Варіант А: Швидкий (мануальні документи - 2 хвилини)**

```bash
# В іншому терміналі
npm run kb:seed
```

Це завантажить 6 вручну підготовлених документів:
- Sociální pojištění OSVČ 2025
- Zdravotní pojištění OSVČ 2025
- Termíny podání daňového přiznání
- Paušální daň 2025
- Registrace k DPH
- Paušální výdaje

**Варіант Б: Повний (web scraping - 15-30 хвилин)**

```bash
npm run kb:scrape
```

Це завантажить всі дані з офіційних сайтів:
- financnisprava.gov.cz
- cssz.cz
- mfcr.cz
- e-sbirka.cz

⚠️ **Увага**: Web scraping може зайняти багато часу та витрачає API credits!

### Крок 4: Перевірка статусу

```bash
npm run kb:stats
```

Відповідь:
```json
{
  "success": true,
  "stats": {
    "totalDocuments": 6,
    "totalChunks": 42,
    "documentsBySource": {
      "manual": 6
    }
  }
}
```

### Крок 5: Тестування AI-чату

1. Відкрийте `http://localhost:3000/ucetnictvi`
2. Натисніть кнопку **"AI Бухгалтер"** у правому верхньому куті
3. Задайте питання, наприклад:
   - "Як порахувати соціальне страхування для OSVČ?"
   - "Які терміни подання податкової декларації?"
   - "Коли треба реєструватися на ПДВ?"

---

## 📚 Архітектура системи

```
┌─────────────────────────────────────────────────────────┐
│                    USER QUESTION                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         AIAccountantChat.tsx (UI Component)              │
│  • Input з питанням                                      │
│  • Історія розмов                                        │
│  • Quick queries (готові питання)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│     API: /api/ai-accountant (RAG Endpoint)              │
│  1. Отримати питання + user context                     │
│  2. Згенерувати embedding для питання                   │
│  3. Шукати схожі chunks у Firestore                     │
│  4. Побудувати контекст                                 │
│  5. Викликати DeepSeek/OpenAI                           │
│  6. Повернути відповідь + джерела                       │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────────┐
│ Embeddings│  │ Firestore │  │ DeepSeek API │
│  OpenAI   │  │   KB     │  │   (AI)       │
└──────────┘  └──────────┘  └──────────────┘
```

### Структура файлів

```
faktury/src/lib/kb/
├── types.ts              # TypeScript типи
├── constants.ts          # Конфігурація, промпти
├── embeddings.ts         # OpenAI embeddings API
├── chunker.ts            # Розбиття тексту на chunks
├── firestore.ts          # Firestore операції
├── rag.ts                # RAG логіка (головний мозок)
├── scraper.ts            # Web scraping
├── manual-seed.ts        # Мануальні документи
└── test-queries.ts       # Тестові питання

faktury/src/components/
└── AIAccountantChat.tsx  # Чат UI

faktury/src/app/api/
├── ai-accountant/        # Головний RAG endpoint
│   └── route.ts
└── kb/                   # KB management
    ├── seed/route.ts     # Мануальне завантаження
    ├── scrape/route.ts   # Web scraping
    └── stats/route.ts    # Статистика
```

---

## 🧪 Тестування

### Автоматичне тестування (TODO)

```bash
npm run test:ai-accountant
```

Це запустить 18 тестових питань та виведе результати:

```
✓ test_001: Sociální pojištění OSVČ (confidence: 0.92)
✓ test_002: Minimální záloha zdravotní (confidence: 0.88)
✓ test_003: Termíny daňového přiznání (confidence: 0.95)
...
17/18 tests passed (94%)
```

### Мануальне тестування

#### Тест 1: Базове питання
**Питання**: "Як порахувати соціальне страхування для OSVČ?"

**Очікувана відповідь повинна містити:**
- Ставку 29.2%
- Мінімальний базис 195 930 Kč
- Формулу розрахунку
- Посилання на ČSSZ

#### Тест 2: Персоналізоване питання
**Передумови**: Користувач має профіль OSVČ з доходом 600 000 Kč

**Питання**: "Скільки я маю платити соціального страхування?"

**Очікувана відповідь повинна містити:**
- Розрахунок на основі 600 000 Kč
- Річна сума
- Місячні авансові платежі
- Терміни платежів

#### Тест 3: Білінгвальність
**Питання (чеською)**: "Kdy musím podat daňové přiznání?"

**Відповідь має бути чеською** з термінами:
- 1. dubna
- 1. července (з daňovým poradcem)

---

## ⚙️ Налаштування та оптимізація

### Конфігурація Chunking

У `src/lib/kb/constants.ts`:

```typescript
export const CHUNKING_CONFIG = {
  maxTokens: 800,      // Розмір chunk (↑ більше контексту, ↓ точність)
  overlap: 100,        // Перекриття між chunks (↑ краще, але більше)
  strategy: 'semantic' // sentence | paragraph | semantic
};
```

**Рекомендації:**
- `maxTokens: 800` - оптимально для чеських податкових документів
- `overlap: 100` - достатньо для збереження контексту
- `strategy: 'semantic'` - найкраще для юридичних текстів

### Конфігурація RAG

```typescript
export const RAG_CONFIG = {
  maxRetrievedChunks: 5,      // ↑ більше контексту, ↓ швидкість
  minSimilarityScore: 0.7,    // ↑ точніше, ↓ менше результатів
  maxContextTokens: 3000,     // Максимум для AI моделі
  temperature: 0.3,           // ↓ точніше, ↑ креативніше
};
```

**Рекомендації:**
- `maxRetrievedChunks: 5` - достатньо для більшості питань
- `minSimilarityScore: 0.7` - хороший баланс
- `temperature: 0.3` - низька для податкових розрахунків

### Embeddings

```typescript
export const EMBEDDING_CONFIG = {
  model: 'text-embedding-3-small',  // Дешевша модель
  dimensions: 1536,                 // Стандарт
  batchSize: 100,                   // ↑ швидше, але більше RAM
};
```

**Альтернативи:**
- `text-embedding-3-large` - точніше, але дорожче
- `text-embedding-ada-002` - старіша, дешевша

---

## 💰 Вартість та ліміти

### OpenAI Embeddings

**Модель**: `text-embedding-3-small`
- **Ціна**: $0.02 / 1M tokens
- **Приклад**: 1000 документів × 500 токенів = 500K токенів = $0.01

**Модель**: `text-embedding-3-large`
- **Ціна**: $0.13 / 1M tokens

### DeepSeek Chat

**Модель**: `deepseek-chat`
- **Input**: $0.14 / 1M tokens
- **Output**: $0.28 / 1M tokens
- **Приклад**: 1 запит (3000 input + 500 output) = $0.0006

**Переваги DeepSeek:**
- 10× дешевше ніж OpenAI GPT-4
- Швидша відповідь
- Підтримка чеської мови

### OpenAI GPT-4o-mini (fallback)

- **Input**: $0.15 / 1M tokens
- **Output**: $0.60 / 1M tokens

### Приблизна вартість

**Початкове завантаження KB (seed):**
- 6 документів × 1000 токенів × 2 (chunking) = 12K токенів
- Embeddings: 12K × $0.02/1M = **$0.0002**

**1000 користувацьких запитів:**
- Retrieval: безкоштовно (Firestore)
- DeepSeek: 1000 × $0.0006 = **$0.60**

**Загалом на місяць** (1000 запитів): **~$0.60** 🎉

---

## 🔐 Безпека

### API Keys

❌ **НІКОЛИ** не комітьте `.env.local` у Git!

✅ Додайте до `.gitignore`:
```
.env.local
.env*.local
```

### Firestore Rules

Переконайтесь, що правила Firestore обмежують доступ:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /knowledge_base/{document} {
      allow read: if request.auth != null;
      allow write: if false; // Тільки через admin SDK
    }
    
    match /kb_chunks/{chunk} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

---

## 🚧 Відомі обмеження

### 1. Web Scraping

**Проблема**: Простий HTML parser не працює з динамічними сайтами (JavaScript)

**Рішення Phase 2**: Puppeteer або Playwright

```bash
npm install puppeteer
```

### 2. Vector Search

**Проблема**: Firestore не має нативної підтримки vector similarity search

**Поточне рішення**: Client-side обчислення (повільно для великих KB)

**Рішення Phase 2**: Pinecone або Qdrant

```bash
# Pinecone
npm install @pinecone-database/pinecone

# Qdrant (self-hosted)
docker run -p 6333:6333 qdrant/qdrant
```

### 3. PDF Parsing

**Проблема**: Scraper поки що не обробляє PDF файли

**Рішення Phase 2**: pdf-parse

```bash
npm install pdf-parse
```

---

## 📊 Моніторинг якості

### Confidence Score

Кожна відповідь AI має `confidence` score (0-1):

- **0.9-1.0**: Відмінно - висока впевненість
- **0.7-0.9**: Добре - достатньо інформації
- **0.5-0.7**: Задовільно - обмежена інформація
- **< 0.5**: Погано - потрібно більше даних

### Логування

Всі запити логуються:

```typescript
console.log({
  question: "...",
  retrievedChunks: 5,
  confidence: 0.92,
  responseTime: "1.2s"
});
```

### Metrics Dashboard (TODO Phase 2)

Створити `/admin/ai-metrics` з:
- Кількість запитів
- Середній confidence
- Популярні питання
- Failed queries

---

## 🔄 Оновлення Knowledge Base

### Мануальне оновлення

```bash
# 1. Завантажити нові дані
npm run kb:scrape

# 2. Перевірити статистику
npm run kb:stats

# 3. Протестувати
# Відкрити /ucetnictvi та задати тестові питання
```

### Автоматичне оновлення (Cron)

**Option A: Vercel Cron Jobs**

Створіть `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/kb/scrape",
    "schedule": "0 3 * * *"
  }]
}
```

**Option B: GitHub Actions**

Створіть `.github/workflows/kb-update.yml`:

```yaml
name: Update Knowledge Base
on:
  schedule:
    - cron: '0 3 * * *'
jobs:
  update-kb:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger KB update
        run: |
          curl -X POST ${{ secrets.API_URL }}/api/kb/scrape \
            -H "Content-Type: application/json" \
            -d '{"action": "scrape_all"}'
```

---

## 🎓 Приклади використання

### Базове питання

```typescript
const response = await fetch('/api/ai-accountant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: "Как порахувати соціальне страхування?",
    language: "uk"
  })
});

const result = await response.json();
console.log(result.answer);
console.log(result.sources);
```

### З user context

```typescript
const response = await fetch('/api/ai-accountant', {
  method: 'POST',
  body: JSON.stringify({
    question: "Скільки я маю платити податків?",
    language: "uk",
    userContext: {
      businessType: "osvc",
      annualIncome: 600000,
      isPausalni: false,
      isVatPayer: false
    }
  })
});
```

---

## 📞 Підтримка

**Питання або проблеми?**

1. Перевірте `KB_README.md`
2. Подивіться на logs у консолі
3. Перевірте `.env.local` змінні
4. Напишіть у Telegram: @your_username

---

## 🎉 Готово!

Ви успішно налаштували AI-бухгалтера! 🚀

**Наступні кроки:**

1. ✅ Протестуйте на реальних питаннях
2. ✅ Зберіть фідбек від користувачів
3. ✅ Моніторте якість відповідей
4. ✅ Додайте більше документів у KB

**Phase 2 плани:**

- [ ] Puppeteer для динамічних сайтів
- [ ] Pinecone для швидкого vector search
- [ ] PDF parsing
- [ ] Admin panel для KB management
- [ ] Metrics dashboard
- [ ] Multi-user chat history

---

**Створено з ❤️ для Faktix Platform**

_Версія: 1.0.0 | Дата: 12.11.2025_


