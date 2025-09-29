import { redirect, notFound } from 'next/navigation';
import { getLink } from '@/lib/link-storage';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
  const { code } = await params;
  
  // Buscar URL original
  const originalUrl = await getLink(code);
  
  if (!originalUrl) {
    // Se não encontrar o link, mostrar página 404
    notFound();
  }
  
  // Redirecionar para a URL original
  redirect(originalUrl);
}