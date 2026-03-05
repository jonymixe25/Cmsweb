import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Settings,
  LogOut,
  Home,
  Users,
  FolderOpen,
} from "lucide-react";

export function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Páginas", path: "/admin/paginas", icon: FileText },
    { name: "Noticias", path: "/admin/noticias", icon: Newspaper },
    { name: "Usuarios", path: "/admin/usuarios", icon: Users },
    { name: "Archivos", path: "/admin/archivos", icon: FolderOpen },
    { name: "Configuración", path: "/admin/configuracion", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            cPanel CMS
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${isActive ? "text-blue-700" : "text-slate-400"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-2">
          <Link
            to="/"
            className="flex items-center px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Home className="mr-3 h-5 w-5 text-slate-400" />
            Ver Sitio
          </Link>
          <button
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            onClick={() => alert("Sesión cerrada (simulado)")}
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
