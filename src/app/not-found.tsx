import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle size={64} className="text-gray-400" />
        </div>
        
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Link não encontrado
        </h1>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          O link que você está procurando não existe ou pode ter expirado. 
          Verifique o endereço ou crie um novo link de pagamento.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Criar novo link
        </Link>
      </div>
    </div>
  );
}
