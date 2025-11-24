import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-700 backdrop-blur-xl bg-white/5 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Acerca de SAE
            </h3>
            <p className="text-sm text-gray-400">
              Sistema de Autenticación Educativa para Reconocimiento Facial y Biométrico
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Enlaces
            </h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Documentación
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Soporte Técnico
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Contacto
            </h3>
            <p className="text-sm text-gray-400">
              Email: soporte@sae.edu
            </p>
            <p className="text-sm text-gray-400">
              Tel: +1 (555) 123-4567
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            © {currentYear} SAE. Todos los derechos reservados. Hecho con
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            para la educación
          </p>
        </div>
      </div>
    </footer>
  );
}