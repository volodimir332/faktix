import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "CZK"): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("cs-CZ").format(date);
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return `${year}${randomNumber}`;
}

export function calculateDPH(amount: number, dphRate = 21): number {
  return (amount * dphRate) / 100;
}

export function calculateTotal(amount: number, dphRate = 21): number {
  return amount + calculateDPH(amount, dphRate);
} 