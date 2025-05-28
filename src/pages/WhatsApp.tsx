
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import WhatsAppBaileys from '@/components/WhatsAppBaileys';
import WhatsAppMessages from '@/components/WhatsAppMessages';
import AIInsights from '@/components/AIInsights';

const WhatsApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">WhatsApp & IA</h1>
          <p className="text-gray-400">Envie suas transações pelo WhatsApp e deixe a IA processar</p>
        </div>
        
        <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg">
          <h3 className="font-medium text-blue-400 mb-2">📱 Como usar o WhatsApp com Baileys:</h3>
          <p className="text-blue-300 mb-2">
            Conecte seu WhatsApp usando a biblioteca Baileys e envie transações diretamente!
          </p>
          <div className="space-y-1 text-sm text-blue-200">
            <p>• "Gasto R$ 50 com almoço"</p>
            <p>• "Recebi R$ 2000 salário"</p>
            <p>• "Paguei R$ 120 conta de luz"</p>
            <p>• "Comprei R$ 80 no supermercado"</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WhatsAppBaileys />
          <AIInsights />
        </div>
        
        <WhatsAppMessages />
      </div>
    </Layout>
  );
};

export default WhatsApp;
