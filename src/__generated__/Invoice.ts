

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Invoice
// ====================================================

export interface Invoice_invoice_items {
  __typename: "InvoiceItem";
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice_invoice_issuedBy {
  __typename: "InvoiceContact";
  name: string;
  address: string;
  zipCode: string;
  state: string;
  city: string;
}

export interface Invoice_invoice_issuedFor {
  __typename: "InvoiceContact";
  name: string;
  address: string;
  zipCode: string;
  state: string;
  city: string;
}

export interface Invoice_invoice {
  __typename: "Invoice";
  id: string;
  sequenceNumber: number;
  locked: boolean;
  customer: string;
  issuer: string;
  terms: string;
  issuedAt: string;  // Change to Date
  dueAt: string;     // Change to Date
  currency: Currency | null;
  amount: number | null;
  questions: string;
  items: Invoice_invoice_items[];
  issuedBy: Invoice_invoice_issuedBy;
  issuedFor: Invoice_invoice_issuedFor;
}

export interface Invoice {
  invoice: Invoice_invoice | null;
}

export interface InvoiceVariables {
  token?: string | null;
}

//==============================================================
// START Enums and Input Objects
// All enums and input objects are included in every output file
// for now, but this will be changed soon.
// TODO: Link to issue to fix this.
//==============================================================

export enum Currency {
  EUR = "EUR",
  USD = "USD",
}

//==============================================================
// END Enums and Input Objects
//==============================================================