'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, Link2 } from 'lucide-react';

interface GeneratedLinkProps {
  url: string;
}

export default function GeneratedLink({ url }: GeneratedLinkProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Link de Pagamento Gerado
      </h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link2 size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Link de Pagamento
            </span>
          </div>
          <div className="bg-gray-50 rounded-md p-4">
            <p className="text-sm text-gray-900 font-medium break-all">
              {url}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={copyToClipboard}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check size={18} />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy size={18} />
              <span>Copiar Link</span>
            </>
          )}
        </button>
        
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink size={18} />
          <span>Abrir Link</span>
        </a>
      </div>
    </div>
  );
}
