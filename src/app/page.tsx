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
      setGeneratedLink(result.url);
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
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg 
                className="w-10 h-10 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
              <span className="text-4xl font-bold text-gray-900">ShazLink</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-700">
              Criar Link de Pagamento
            </h1>
          </div>
          
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