import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Home, FileSpreadsheet, User, LogOut, Fingerprint, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Inicio", testId: "sidebar-home" },
    { path: "/biometric", icon: Fingerprint, label: "Sistema Biométrico", testId: "sidebar-biometric" },
    { path: "/sheets", icon: FileSpreadsheet, label: "Registro de Datos", testId: "sidebar-sheets" },
    { path: "/profile", icon: User, label: "Mi Perfil", testId: "sidebar-profile" },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40
          backdrop-blur-xl bg-white/5 border-r border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        data-testid="sidebar"
      >
        {/* Close button for mobile */}
        <div className="lg:hidden absolute top-4 right-4">
          <Button
            data-testid="sidebar-close-button"
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              SAE
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Sistema de Autenticación Educativa
          </p>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Avatar data-testid="sidebar-user-avatar">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate" data-testid="sidebar-username">
                  {user.username}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={item.testId}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-700">
          <Button
            data-testid="sidebar-logout-button"
            onClick={handleLogout}
            variant="outline"
            className="w-full border-gray-600 text-white hover:bg-red-600/20 hover:text-red-400 hover:border-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
    </>
  );
}