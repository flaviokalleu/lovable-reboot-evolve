
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import WhatsAppConnection from '@/components/WhatsAppConnection';
import WhatsAppMessages from '@/components/WhatsAppMessages';
import AIInsights from '@/components/AIInsights';

const WhatsApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          <h1 className="text-2xl font-bold text-gray-900">WhatsApp & IA</h1>
          <p className="text-gray-600">Conecte seu WhatsApp e use a IA financeira</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WhatsAppConnection />
          <AIInsights />
        </div>
        
        <WhatsAppMessages />
      </div>
    </Layout>
  );
};

export default WhatsApp;
