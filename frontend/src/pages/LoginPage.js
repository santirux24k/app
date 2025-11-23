import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, Mail } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      toast.success("Login exitoso");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.detail || "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#3b82f6' }}>
            SAE
          </h1>
          <p className="text-lg text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
            Sistema de Autenticación Educativa
          </p>
        </div>

        <Card data-testid="login-card" className="backdrop-blur-xl bg-white/5 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-400">Ingrese sus credenciales de profesor</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    data-testid="login-email-input"
                    id="email"
                    type="email"
                    placeholder="profesor@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/10 border-gray-600 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    data-testid="login-password-input"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-white/10 border-gray-600 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <Button
                data-testid="login-submit-button"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={loading}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                ¿No tiene una cuenta?{" "}
                <Link
                  data-testid="register-link"
                  to="/register"
                  className="text-blue-500 hover:text-blue-400 font-medium"
                >
                  Regístrese aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}