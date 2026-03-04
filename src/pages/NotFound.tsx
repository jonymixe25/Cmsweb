import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-slate-200">404</h1>
        <div className="mt-[-2rem]">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Página no encontrada</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200"
          >
            <Home className="mr-2 h-5 w-5" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
