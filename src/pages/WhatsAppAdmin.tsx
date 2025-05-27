
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Settings, Zap } from 'lucide-react';

const WhatsAppAdmin = () => {
  const { user, loading, isAdmin } = useAuth();

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
          <p className="text-green-100">Configure e gerencie a integração com WhatsApp</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Code Generator */}
          <div className="lg:col-span-2">
            <QRCodeGenerator />
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Recursos Ativos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Processamento IA</span>
                  <span className="text-green-600 font-semibold">Ativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-resposta</span>
                  <span className="text-green-600 font-semibold">Ativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sync Transações</span>
                  <span className="text-green-600 font-semibold">Ativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup Automático</span>
                  <span className="text-blue-600 font-semibold">Habilitado</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Sistema Melhorado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 text-sm">✅ Novo Sistema</h4>
                  <p className="text-green-700 text-xs">
                    Sistema independente sem banco de dados, mais rápido e confiável.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 text-sm">🔧 Automático</h4>
                  <p className="text-blue-700 text-xs">
                    Conexão e autenticação automáticas em 15 segundos.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 text-sm">🚀 Performance</h4>
                  <p className="text-purple-700 text-xs">
                    Processamento local sem latência de servidor.
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
