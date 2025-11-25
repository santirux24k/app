import { useState, useEffect } from "react";
import { ExternalLink, Maximize2, Minimize2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BIOMETRIC_URL = "http://172.20.10.2";

export default function BiometricPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [serviceAvailable, setServiceAvailable] = useState(true);
  const [loading, setLoading] = useState(true);

  // Verificar disponibilidad del servicio
  useEffect(() => {
    const controller = new AbortController();
    fetch(BIOMETRIC_URL, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error("Servicio no disponible");
        setServiceAvailable(true);
      })
      .catch(() => setServiceAvailable(false))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const handleOpenExternal = () => {
    window.open(BIOMETRIC_URL, "_blank");
  };

  return (
    <div className="container mx-auto max-w-7xl p-4" data-testid="biometric-page">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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

      {/* Card del iframe */}
      <Card className={`backdrop-blur-xl bg-white/5 border-gray-700 shadow-lg ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
        <CardContent className="p-0">
          <div className={`relative ${isFullscreen ? 'h-full' : 'h-[600px] md:h-[700px]'}`}>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
                <p className="text-gray-400 text-lg">Cargando sistema biométrico...</p>
              </div>
            ) : serviceAvailable ? (
              <iframe
                data-testid="biometric-iframe"
                src={BIOMETRIC_URL}
                className="w-full h-full rounded-lg"
                title="Sistema Biométrico"
                style={{ border: 'none' }}
                onError={() => setServiceAvailable(false)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <AlertCircle className="text-red-500 w-12 h-12" />
                <p className="text-red-400 text-lg text-center font-semibold">
                  ❌ No se pudo detectar la cámara o el servicio biométrico no está disponible.
                </p>
                <Button
                  onClick={handleOpenExternal}
                  className="bg-red-600 hover:bg-red-700 mt-2"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir en Nueva Pestaña
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      {!isFullscreen && (
        <div className="mt-6">
          <Card className="backdrop-blur-xl bg-white/5 border-gray-700 shadow">
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
