'use client';

import { useState, useEffect } from 'react';
import { Package, X, Link } from 'lucide-react';
import ProductModal from './ProductModal';
import { PaymentLinkData, Product } from '@/types';

interface PaymentLinkFormProps {
  onSubmit: (data: PaymentLinkData) => void;
  isLoading: boolean;
}

export default function PaymentLinkForm({ onSubmit, isLoading }: PaymentLinkFormProps) {
  const [amount, setAmount] = useState('');
  const [recipientHandle, setRecipientHandle] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isHandleAutoDetected, setIsHandleAutoDetected] = useState(false);

  useEffect(() => {
    // Detectar handle do usuário quando aberto pelo app
    const detectUserHandle = () => {
      // Método 1: Verificar query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const handleFromUrl = urlParams.get('handle') || urlParams.get('user') || urlParams.get('username');
      
      // Log para debug
      if (urlParams.toString()) {
        console.log('Query parameters detectados:', urlParams.toString());
      }
      
      if (handleFromUrl) {
        setRecipientHandle(handleFromUrl.replace('@', ''));
        setIsHandleAutoDetected(true);
        console.log('Handle detectado via URL:', handleFromUrl);
        return;
      }

      // Método 2: Verificar se há dados no sessionStorage/localStorage
      const storedHandle = sessionStorage.getItem('userHandle') || localStorage.getItem('userHandle');
      if (storedHandle) {
        setRecipientHandle(storedHandle.replace('@', ''));
        setIsHandleAutoDetected(true);
        return;
      }

      // Método 3: Escutar mensagens do app pai (postMessage)
      const handleMessage = (event: MessageEvent) => {
        // Log para debug (remover em produção)
        console.log('Mensagem recebida:', {
          origin: event.origin,
          data: event.data
        });

        // Verificar origem segura (ajustar domínio conforme necessário)
        // Aceitar também localhost para desenvolvimento
        const allowedOrigins = [
          'https://app.infinitepay.io',
          'https://infinitepay.io',
          'http://localhost:3000',
          'http://localhost:3001'
        ];

        if (!allowedOrigins.includes(event.origin)) {
          console.warn('Mensagem rejeitada de origem não autorizada:', event.origin);
          return;
        }

        if (event.data && (event.data.handle || event.data.userHandle || event.data.username)) {
          const handle = event.data.handle || event.data.userHandle || event.data.username;
          setRecipientHandle(handle.replace('@', ''));
          setIsHandleAutoDetected(true);
          
          // Salvar no sessionStorage para uso futuro
          sessionStorage.setItem('userHandle', handle);
          
          console.log('Handle detectado via postMessage:', handle);
        }
      };

      window.addEventListener('message', handleMessage);

      // Enviar mensagem solicitando o handle (caso o app pai esteja esperando)
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'REQUEST_USER_HANDLE' }, '*');
      }

      // Cleanup
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    };

    detectUserHandle();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !recipientHandle) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const data: PaymentLinkData = {
      amount: parseFloat(amount),
      recipientHandle: recipientHandle.replace('@', ''),
      product: product || undefined,
    };

    onSubmit(data);
  };

  const handleProductAdd = (productData: Product) => {
    setProduct(productData);
    setShowProductModal(false);
  };

  const removeProduct = () => {
    setProduct(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Valor (R$)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="0,00"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-2">
            Handle do Recebedor
            {isHandleAutoDetected && (
              <span className="ml-2 text-xs text-green-600 font-normal">
                (detectado automaticamente)
              </span>
            )}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              @
            </span>
            <input
              type="text"
              id="handle"
              value={recipientHandle}
              onChange={(e) => {
                setRecipientHandle(e.target.value);
                setIsHandleAutoDetected(false); // Remove o indicador quando o usuário editar
              }}
              className={`w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                isHandleAutoDetected ? 'border-green-300 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="usuario"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Produto (opcional)
          </label>
          
          {!product ? (
            <button
              type="button"
              onClick={() => setShowProductModal(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Package size={20} />
              <span>Associar produto ao link</span>
            </button>
          ) : (
            <div className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  {product.imageUrl && (
                    <p className="text-sm text-gray-500">Com imagem</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={removeProduct}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Gerando...</span>
            </>
          ) : (
            <>
              <Link size={20} />
              <span>Gerar Link de Pagamento</span>
            </>
          )}
        </button>
      </form>

      {showProductModal && (
        <ProductModal
          onClose={() => setShowProductModal(false)}
          onConfirm={handleProductAdd}
        />
      )}
    </>
  );
}
