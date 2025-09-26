import { NextRequest, NextResponse } from 'next/server';

// Armazenamento em memória (em produção, use um banco de dados)
const linkStorage = new Map<string, string>();

// Função para gerar código curto único
function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST - Criar link curto
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL é obrigatória' },
        { status: 400 }
      );
    }

    // Gerar código único
    let shortCode = generateShortCode();
    while (linkStorage.has(shortCode)) {
      shortCode = generateShortCode();
    }

    // Armazenar
    linkStorage.set(shortCode, url);

    // Retornar URL curta
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('host') || 'localhost:3000';
    const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
    const shortUrl = `${protocol}://${baseUrl}/p/${shortCode}`;

    return NextResponse.json({ 
      shortUrl,
      shortCode,
      originalUrl: url
    });
    
  } catch (error) {
    console.error('Erro ao criar link curto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET - Buscar link original
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json(
      { error: 'Código não fornecido' },
      { status: 400 }
    );
  }

  const originalUrl = linkStorage.get(code);
  
  if (!originalUrl) {
    return NextResponse.json(
      { error: 'Link não encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json({ url: originalUrl });
}
