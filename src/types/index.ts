export interface PaymentLinkData {
  amount: number;
  recipientHandle: string;
  product?: {
    name: string;
    imageUrl: string;
  };
}

export interface Product {
  name: string;
  imageUrl: string;
}
