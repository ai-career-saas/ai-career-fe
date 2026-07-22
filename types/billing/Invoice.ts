export interface Invoice {
  id: string;
  amountPaid: number;
  currency: string;
  status: string;
  createdAt: string;
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
}
