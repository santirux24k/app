import { useState } from "react";
import { ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BIOMETRIC_URL = "http://172.20.10.2";

export default function BiometricPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleOpenExternal = () => {
    window.open(BIOMETRIC_URL, "_blank");
  };

  return (
    <div className="container mx-auto max-w-7xl" data-testid="biometric-page">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Sistema Biométrico
            </h1>
            <p className="text-gray-400">Acceso al sistema de reconocimiento facial</p>
          </div>
          <div className="flex gap-2">
            <Button
              data-testid="fullscreen-toggle-button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="outline"
              className="border-gray-600 text-white hover:bg-white/10"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="mr-2 h-4 w-4" />
                  Minimizar
                </>
              ) : (
                <>
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Pantalla Completa
                </>
              )}
            </Button>
            <Button
              data-testid="open-external-button"
              onClick={handleOpenExternal}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir en Nueva Pestaña
            </Button>
          </div>
        </div>
      </div>

      <Card className={`backdrop-blur-xl bg-white/5 border-gray-700 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
        <CardContent className="p-0">
          <div className={`relative ${isFullscreen ? 'h-full' : 'h-[600px] md:h-[700px]'}`}>
            <iframe
              data-testid="biometric-iframe"
              src={BIOMETRIC_URL}
              className="w-full h-full rounded-lg"
              title="Sistema Biométrico"
              style={{ border: 'none' }}
            />
          </div>
        </CardContent>
      </Card>

      {!isFullscreen && (
        <div className="mt-6">
          <Card className="backdrop-blur-xl bg-white/5 border-gray-700">
            <CardContent className="py-4">
              <p className="text-sm text-gray-400 text-center">
                Si el sistema no se visualiza correctamente, haz clic en "Abrir en Nueva Pestaña"
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}