import { redirect } from 'next/navigation';

async function getOriginalUrl(code: string): Promise<string | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000';
    const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
    
    const response = await fetch(`${protocol}://${baseUrl}/api/shortlink?code=${code}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Erro ao buscar URL:', error);
    return null;
  }
}

export default async function RedirectPage({
  params
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params;
  const originalUrl = await getOriginalUrl(code);
  
  if (originalUrl) {
    redirect(originalUrl);
  }
  
  // Se não encontrar o link, mostrar página de erro
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Link não encontrado
        </h1>
        <p className="text-gray-600">
          O link que você está procurando não existe ou expirou.
        </p>
      </div>
    </div>
  );
}
