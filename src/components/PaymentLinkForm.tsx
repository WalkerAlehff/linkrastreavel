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
      // Log completo do ambiente
      console.log('=== Iniciando detecção de handle ===');
      console.log('URL completa:', window.location.href);
      console.log('User Agent:', navigator.userAgent);
      console.log('Referrer:', document.referrer);
      console.log('Em iframe?:', window.parent !== window);
      
      // Método 1: Verificar query parameters
      const urlParams = new URLSearchParams(window.location.search);
      
      // Verificar TODOS os parâmetros possíveis
      const possibleParams = ['handle', 'user', 'username', 'merchant', 'seller', 'vendedor', 'usuario'];
      let handleFromUrl = null;
      
      for (const param of possibleParams) {
        const value = urlParams.get(param);
        if (value) {
          handleFromUrl = value;
          console.log(`Handle encontrado no parâmetro '${param}':`, value);
          break;
        }
      }
      
      // Log de todos os parâmetros
      if (urlParams.toString()) {
        console.log('Todos os query parameters:', Object.fromEntries(urlParams));
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

        // Aceitar mensagens de qualquer origem da InfinitePay
        const isInfinitePayOrigin = event.origin.includes('infinitepay') || 
                                    event.origin.includes('infinite-pay') ||
                                    event.origin.includes('localhost');
        
        if (!isInfinitePayOrigin) {
          console.warn('Mensagem de origem:', event.origin);
          // Não rejeitar, apenas logar para debug
        }

        // Verificar vários formatos possíveis de mensagem
        let detectedHandle = null;
        
        // Formato 1: Objeto com propriedades diretas
        if (event.data && typeof event.data === 'object') {
          detectedHandle = event.data.handle || 
                          event.data.userHandle || 
                          event.data.username ||
                          event.data.merchant ||
                          event.data.seller ||
                          event.data.user ||
                          event.data.vendedor;
        }
        
        // Formato 2: String direta
        if (!detectedHandle && typeof event.data === 'string') {
          detectedHandle = event.data;
        }
        
        // Formato 3: Objeto aninhado (ex: data.user.handle)
        if (!detectedHandle && event.data && event.data.user) {
          detectedHandle = event.data.user.handle || 
                          event.data.user.username ||
                          event.data.user.name;
        }
        
        if (detectedHandle) {
          setRecipientHandle(String(detectedHandle).replace('@', ''));
          setIsHandleAutoDetected(true);
          
          // Salvar no sessionStorage para uso futuro
          sessionStorage.setItem('userHandle', detectedHandle);
          
          console.log('Handle detectado via postMessage:', detectedHandle);
          console.log('Dados completos da mensagem:', event.data);
        }
      };

      window.addEventListener('message', handleMessage);

      // Enviar mensagem solicitando o handle (caso o app pai esteja esperando)
      if (window.parent !== window) {
        // Tentar vários tipos de mensagem
        window.parent.postMessage({ type: 'REQUEST_USER_HANDLE' }, '*');
        window.parent.postMessage({ type: 'GET_USER_INFO' }, '*');
        window.parent.postMessage({ action: 'getUserHandle' }, '*');
        
        console.log('Mensagens de solicitação enviadas ao app pai');
      }

      // Método 4: Verificar cookies (se acessível)
      try {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name && value && ['handle', 'user', 'username', 'merchant'].includes(name.toLowerCase())) {
            console.log(`Cookie encontrado: ${name}=${value}`);
            // Nota: Cookies geralmente não são acessíveis entre domínios diferentes
          }
        }
      } catch (e) {
        console.log('Erro ao acessar cookies:', e);
      }

      // Método 5: Verificar window.name (às vezes usado para passar dados)
      if (window.name) {
        console.log('window.name:', window.name);
        try {
          const data = JSON.parse(window.name);
          if (data.handle || data.user) {
            setRecipientHandle((data.handle || data.user).replace('@', ''));
            setIsHandleAutoDetected(true);
            console.log('Handle detectado via window.name:', data);
          }
        } catch (e) {
          // window.name pode não ser JSON
        }
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
