export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  ico?: string;
  dic?: string;
  phone?: string;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  ico?: string;
  dic?: string;
  address?: Address;
  paymentMethod?: PaymentMethod;
  defaultDueDate?: number; // days
  language?: Language;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  ico: string;
  dic: string;
  typZivnosti?: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  client?: Client;
  issueDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  dphRate: number;
  dphAmount: number;
  total: number;
  variableSymbol?: string;
  paymentMethod: PaymentMethod;
  bankAccount?: string;
  notes?: string;
  sentAt?: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  dphRate: number;
  total: number;
}

export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent", 
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled"
}

export enum PaymentMethod {
  BANK_TRANSFER = "bank_transfer",
  CASH = "cash",
  CARD = "card",
  ONLINE = "online"
}

export enum Language {
  CS = "cs",
  UK = "uk",
  EN = "en"
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  receipt?: string; // file path
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ExpenseCategory {
  OFFICE = "office",
  TRAVEL = "travel", 
  MARKETING = "marketing",
  SOFTWARE = "software",
  EQUIPMENT = "equipment",
  OTHER = "other"
}

export interface DashboardStats {
  monthlyRevenue: number;
  unpaidInvoices: number;
  newInvoicesThisWeek: number;
  averageInvoiceAmount: number;
  totalClients: number;
  overdueInvoices: number;
} 