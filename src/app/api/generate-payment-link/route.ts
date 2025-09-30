import { NextRequest, NextResponse } from 'next/server';
import { PaymentLinkData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const data: PaymentLinkData = await request.json();
    
    // Validar dados
    if (!data.amount || !data.recipientHandle) {
      return NextResponse.json(
        { error: 'Dados inválidos: valor e handle do recebedor são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar valor mínimo (1 centavo)
    if (data.amount <= 0) {
      return NextResponse.json(
        { error: 'O valor deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Remover @ do handle se presente
    const handle = data.recipientHandle.replace('@', '');

    // Preparar dados do checkout
    const checkoutData = {
      handle: handle, // Usar handle sem @
      order_nsu: `LINK_${Date.now()}`,
      items: [
        {
          quantity: 1,
          price: Math.round(data.amount * 100), // Converter para centavos
          description: data.product?.name || 'Link de Pagamento',
        }
      ]
    };

    // Nota: A API da InfinitePay não suporta imagens diretamente no checkout
    // A URL da imagem é armazenada apenas no frontend para exibição

    // Log dos dados sendo enviados (remover em produção)
    console.log('Enviando para InfinitePay:', JSON.stringify(checkoutData, null, 2));

    // Fazer chamada para API da InfinitePay
    const response = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API InfinitePay:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        checkoutData: checkoutData
      });
      
      return NextResponse.json(
        { 
          error: 'Erro ao gerar link de pagamento',
          details: process.env.NODE_ENV === 'development' ? errorText : undefined
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    return NextResponse.json({ 
      url: result.url,
      checkoutData: checkoutData // Para debug, pode remover em produção
    });
    
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
