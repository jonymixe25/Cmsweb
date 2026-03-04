import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Newspaper } from "lucide-react";

export function Dashboard() {
  const [stats, setStats] = useState({ pages: 0, news: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/pages").then((res) => res.json()),
      fetch("/api/news").then((res) => res.json()),
    ]).then(([pages, news]) => {
      setStats({ pages: pages.length, news: news.length });
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex items-center">
          <div className="p-4 bg-blue-100 rounded-full text-blue-600 mr-6">
            <FileText size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Páginas
            </p>
            <p className="text-3xl font-bold text-slate-900">{stats.pages}</p>
            <Link
              to="/admin/paginas"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
            >
              Gestionar páginas &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex items-center">
          <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 mr-6">
            <Newspaper size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Noticias
            </p>
            <p className="text-3xl font-bold text-slate-900">{stats.news}</p>
            <Link
              to="/admin/noticias"
              className="text-emerald-600 hover:text-emerald-800 text-sm font-medium mt-2 inline-block"
            >
              Gestionar noticias &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
