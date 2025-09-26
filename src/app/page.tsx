'use client';

import { useState } from 'react';
import PaymentLinkForm from '@/components/PaymentLinkForm';
import GeneratedLink from '@/components/GeneratedLink';
import { PaymentLinkData } from '@/types';

export default function Home() {
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateLink = async (data: PaymentLinkData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar link de pagamento');
      }

      const result = await response.json();
      
      // Encurtar o link
      const shortResponse = await fetch('/api/shortlink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: result.url }),
      });

      if (shortResponse.ok) {
        const shortData = await shortResponse.json();
        setGeneratedLink(shortData.shortUrl);
      } else {
        // Se falhar o encurtamento, usar o link original
        setGeneratedLink(result.url);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar link de pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 text-center mb-8">
            Criar Link de Pagamento
          </h1>
          
          <PaymentLinkForm 
            onSubmit={handleGenerateLink} 
            isLoading={isLoading}
          />
          
          {generatedLink && (
            <div className="mt-8">
              <GeneratedLink url={generatedLink} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}