'use client';

import { useEffect, useState } from 'react';

interface DebugInfo {
  url: string;
  queryParams: Record<string, string>;
  hash: string;
  referrer: string;
  userAgent: string;
  isInIframe: boolean;
  windowName: string;
  cookies: string;
  localStorage: Record<string, string | null>;
  sessionStorage: Record<string, string | null>;
  timestamp: string;
}

interface MessageInfo {
  origin: string;
  data: any;
  timestamp: string;
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [userDataResult, setUserDataResult] = useState<any>(null);

  useEffect(() => {
    // Coletar todas as informações possíveis
    const collectInfo = async () => {
      const info: DebugInfo = {
        url: window.location.href,
        queryParams: Object.fromEntries(new URLSearchParams(window.location.search)),
        hash: window.location.hash,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        isInIframe: window.parent !== window,
        windowName: window.name,
        cookies: document.cookie,
        localStorage: {},
        sessionStorage: {},
        timestamp: new Date().toISOString()
      };

      // Verificar se getUserData está disponível
      if (typeof (window as any).getUserData === 'function') {
        try {
          console.log('Função getUserData encontrada! Chamando...');
          const userData = await (window as any).getUserData();
          setUserDataResult({
            success: true,
            data: userData,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          setUserDataResult({
            success: false,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
          });
        }
      } else {
        setUserDataResult({
          success: false,
          error: 'Função getUserData não encontrada',
          timestamp: new Date().toISOString()
        });
      }

    // Tentar ler localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          info.localStorage[key] = localStorage.getItem(key);
        }
      }
    } catch (e) {
      info.localStorage = { error: 'Erro ao acessar' };
    }

    // Tentar ler sessionStorage
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          info.sessionStorage[key] = sessionStorage.getItem(key);
        }
      }
    } catch (e) {
      info.sessionStorage = { error: 'Erro ao acessar' };
    }

      setDebugInfo(info);
    };

    collectInfo();

    // Escutar todas as mensagens
    const handleMessage = (event: MessageEvent) => {
      const messageInfo = {
        origin: event.origin,
        data: event.data,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, messageInfo]);
      console.log('Mensagem recebida no debug:', messageInfo);
    };

    window.addEventListener('message', handleMessage);

    // Se estiver em iframe, enviar várias mensagens de teste
    if (window.parent !== window) {
      const testMessages = [
        { type: 'REQUEST_USER_HANDLE' },
        { type: 'GET_USER_INFO' },
        { action: 'getUserHandle' },
        { request: 'userInfo' },
        { cmd: 'getHandle' }
      ];

      testMessages.forEach((msg, index) => {
        setTimeout(() => {
          window.parent.postMessage(msg, '*');
          console.log('Enviando mensagem de teste:', msg);
        }, index * 100);
      });
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug - Detecção de Handle</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Informações do Ambiente</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Resultado de getUserData()</h2>
          {userDataResult ? (
            <pre className={`p-4 rounded overflow-auto text-xs ${
              userDataResult.success ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {JSON.stringify(userDataResult, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">Verificando disponibilidade de getUserData()...</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Mensagens Recebidas ({messages.length})</h2>
          {messages.length === 0 ? (
            <p className="text-gray-500">Nenhuma mensagem recebida ainda...</p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(msg, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Instruções:</strong> Abra esta página dentro do app da InfinitePay para ver como os dados estão sendo passados.
            Todas as informações relevantes serão exibidas acima.
          </p>
        </div>
      </div>
    </div>
  );
}
