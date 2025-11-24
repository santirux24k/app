import { ExternalLink, Lock, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const BIOMETRIC_URL = "http://172.20.10.2";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleBiometricRedirect = () => {
    navigate("/biometric");
  };

  const handleSheetsRedirect = () => {
    navigate("/sheets");
  };

  return (
    <div className="container mx-auto max-w-5xl">
      {/* Title Section */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#3b82f6' }}>
          Panel de Control
        </h2>
        <p className="text-base md:text-lg text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
          Sistema de Reconocimiento Facial y Biométrico
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" data-testid="dashboard-container">
        {/* Biometric System Card */}
        <Card className="backdrop-blur-xl bg-white/5 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl md:text-2xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 md:py-6 text-base md:text-lg"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Acceder al Sistema
              <ExternalLink className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Google Sheets Card */}
        <Card className="backdrop-blur-xl bg-white/5 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl md:text-2xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 md:py-6 text-base md:text-lg"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Abrir Registro
              <ExternalLink className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <div className="mt-8 md:mt-12">
        <Card className="backdrop-blur-xl bg-white/5 border-gray-700">
          <CardContent className="py-6">
            <p className="text-gray-400 text-sm text-center">
              Sistema de Autenticación Educativa - Reconocimiento Facial y Biométrico
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}