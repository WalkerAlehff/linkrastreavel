// Tipos da API InfinitePay MiniApp
declare global {
  interface Window {
    Infinitepay?: {
      getUserData(): Promise<ApiResponse<UserData>>;
      receiveTapPayment(params: TapPaymentParams): Promise<ApiResponse<TapPaymentData>>;
      sendCheckoutPayment(url: string): Promise<ApiResponse<CheckoutPaymentData>>;
    };
  }
}

export enum PaymentMethod {
  CREDIT = 'credit',
  DEBIT = 'debit'
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface UserData {
  id: number;
  name: string;
  handle: string;
  role: string;
}

export interface TapPaymentParams {
  amount: number;        // Valor em centavos
  orderNsu: string;      // Identificador único
  installments: number;  // 1 para débito, 1-12 para crédito
  paymentMethod: PaymentMethod;
}

export interface TapPaymentData {
  transactionNsu: string;
  amount: number;
  paymentMethod: string;
}

export interface CheckoutPaymentData {
  transactionNsu: string;
  receiptUrl: string;
  amount: number;
}

export interface CheckoutData {
  handle: string;        // Handle sem $
  order_nsu: string;     // Identificador único
  items: {
    quantity: number;    // Deve ser > 0
    price: number;       // Valor em centavos
    description: string; // Nome do item
  }[];
  customer?: {
    name?: string;
    email?: string;
    phone_number?: string;  // Nota: phone_number, não phone
  };
}
