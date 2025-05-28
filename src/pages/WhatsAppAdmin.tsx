
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import WhatsAppBaileys from '@/components/WhatsAppBaileys';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Settings, Zap } from 'lucide-react';

const WhatsAppAdmin = () => {
  const { user, loading, isAdmin } = useAuth();

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

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            Administração WhatsApp
          </h1>
          <p className="text-green-100">Configure e gerencie a integração com WhatsApp usando Baileys</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Baileys Integration */}
          <div className="lg:col-span-2 space-y-6">
            <WhatsAppBaileys />
            <QRCodeGenerator />
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5" />
                  Recursos Baileys
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Conexão Direta</span>
                  <span className="text-green-400 font-semibold">Ativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">QR Code Gerado</span>
                  <span className="text-green-400 font-semibold">Sim</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Auto-resposta</span>
                  <span className="text-green-400 font-semibold">Ativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Processamento IA</span>
                  <span className="text-blue-400 font-semibold">Habilitado</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5" />
                  Baileys vs WPPConnect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-900/30 rounded-lg border border-green-800">
                  <h4 className="font-semibold text-green-400 text-sm">✅ Baileys</h4>
                  <p className="text-green-300 text-xs">
                    Biblioteca oficial, mais estável e confiável.
                  </p>
                </div>
                <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-800">
                  <h4 className="font-semibold text-blue-400 text-sm">🔧 QR Code Nativo</h4>
                  <p className="text-blue-300 text-xs">
                    Geração de QR Code integrada no frontend.
                  </p>
                </div>
                <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-800">
                  <h4 className="font-semibold text-purple-400 text-sm">🚀 Performance</h4>
                  <p className="text-purple-300 text-xs">
                    Conexão direta sem intermediários.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WhatsAppAdmin;
