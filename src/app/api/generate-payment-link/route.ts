import { NextRequest, NextResponse } from 'next/server';
import { PaymentLinkData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const data: PaymentLinkData = await request.json();
    
    // Validar dados
    if (!data.amount || !data.recipientHandle) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Preparar dados do checkout
    const checkoutData = {
      handle: data.recipientHandle,
      order_nsu: `LINK_${Date.now()}`,
      items: [
        {
          quantity: 1,
          price: Math.round(data.amount * 100), // Converter para centavos
          description: data.product?.name || 'Link de Pagamento',
        }
      ]
    };

    // Se houver informações do produto, adicionar à descrição
    if (data.product?.imageUrl) {
      // Nota: A API da InfinitePay não suporta imagens diretamente no checkout
      // Mas podemos incluir a URL na descrição ou em metadados
      checkoutData.items[0].description += ` (${data.product.imageUrl})`;
    }

    // Fazer chamada para API da InfinitePay
    const response = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Erro da API InfinitePay:', error);
      return NextResponse.json(
        { error: 'Erro ao gerar link de pagamento' },
        { status: 500 }
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
