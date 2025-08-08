// Утиліти для роботи з фактурами

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: string;
  items: InvoiceItem[];
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Генерація унікального номера фактури
export function generateInvoiceNumber(existingInvoices: InvoiceData[] = []): string {
  const currentYear = new Date().getFullYear();
  
  // Знаходимо максимальний номер для поточного року
  const yearInvoices = existingInvoices.filter(invoice => 
    invoice.invoiceNumber.startsWith(currentYear.toString())
  );
  
  let maxNumber = 0;
  
  yearInvoices.forEach(invoice => {
    const match = invoice.invoiceNumber.match(new RegExp(`^${currentYear}-(\\d+)$`));
    if (match) {
      const number = parseInt(match[1], 10);
      if (number > maxNumber) {
        maxNumber = number;
      }
    }
  });
  
  // Генеруємо наступний номер
  const nextNumber = maxNumber + 1;
  
  // Форматуємо номер з ведучими нулями (4 цифри)
  return `${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
}

// Генерація унікального ID
export function generateInvoiceId(): string {
  return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Валідація номера фактури
export function validateInvoiceNumber(invoiceNumber: string): boolean {
  const pattern = /^\d{4}-\d{4}$/;
  return pattern.test(invoiceNumber);
}

// Форматування дати
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Розрахунок дати оплати (за замовчуванням +14 днів)
export function calculateDueDate(issueDate: string, daysToAdd: number = 14): string {
  const date = new Date(issueDate);
  date.setDate(date.getDate() + daysToAdd);
  return formatDate(date);
}

// Розрахунок загальної суми
export function calculateTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}

// Перевірка чи є фактура простроченою
export function isInvoiceOverdue(invoice: InvoiceData): boolean {
  // Якщо фактура вже заплачена, вона не може бути простроченою
  if (invoice.status === 'paid') {
    return false;
  }
  
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  
  // Фактура прострочена, якщо дата сплати пройшла
  return dueDate < today;
}

// Автоматичне оновлення статусу фактури на основі дати
export function getAutoUpdatedStatus(invoice: InvoiceData): 'draft' | 'sent' | 'paid' | 'overdue' {
  // Якщо фактура заплачена, статус не змінюється
  if (invoice.status === 'paid') {
    return 'paid';
  }
  
  // Якщо фактура прострочена, змінюємо статус
  if (isInvoiceOverdue(invoice)) {
    return 'overdue';
  }
  
  // Інакше повертаємо поточний статус
  return invoice.status;
} 