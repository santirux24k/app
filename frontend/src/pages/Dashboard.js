import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, LogOut, Lock, FileSpreadsheet } from "lucide-react";

const BIOMETRIC_URL = "http://172.20.10.2";
const GOOGLE_SHEETS_URL = "https://docs.google.com/spreadsheets/d/1njY05IbIOvwk4MmFKa9aCTtnheB6KSuSQLpU1G-eRMI/edit?gid=0#gid=0";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleBiometricRedirect = () => {
    window.open(BIOMETRIC_URL, "_blank");
  };

  const handleSheetsRedirect = () => {
    window.open(GOOGLE_SHEETS_URL, "_blank");
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      {/* Header */}
      <header className="border-b border-gray-700 backdrop-blur-xl bg-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              SAE
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm text-gray-400">Bienvenido,</p>
                <p className="text-white font-medium" data-testid="user-username">{user.username}</p>
              </div>
            )}
            <Button
              data-testid="logout-button"
              onClick={handleLogout}
              variant="outline"
              className="border-gray-600 text-white hover:bg-red-600/20 hover:text-red-400 hover:border-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#3b82f6' }}>
              Panel de Control
            </h2>
            <p className="text-lg text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              Sistema de Reconocimiento Facial y Biométrico
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8" data-testid="dashboard-container">
            {/* Biometric System Card */}
            <Card className="backdrop-blur-xl bg-white/5 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Sistema Biométrico
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Acceso al sistema de reconocimiento facial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  data-testid="biometric-redirect-button"
                  onClick={handleBiometricRedirect}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 text-lg"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Acceder al Sistema
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Google Sheets Card */}
            <Card className="backdrop-blur-xl bg-white/5 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Registro de Datos
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Hoja de cálculo de Google Sheets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  data-testid="sheets-redirect-button"
                  onClick={handleSheetsRedirect}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 text-lg"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Abrir Registro
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="mt-12 text-center">
            <Card className="backdrop-blur-xl bg-white/5 border-gray-700">
              <CardContent className="py-6">
                <p className="text-gray-400 text-sm">
                  Sistema de Autenticación Educativa - Reconocimiento Facial y Biométrico
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}