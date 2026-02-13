// Billing schema
export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'paused';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  paidAt?: Date;
  stripeInvoiceId?: string;
}

export interface UsageMetrics {
  userId: string;
  period: string;
  coverLettersGenerated: number;
  resumesCreated: number;
  applicationsSubmitted: number;
}
