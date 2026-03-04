import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function NewsList() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-slate-500">
        Cargando noticias...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-12 text-center">
        Todas las Noticias
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <div
            key={item.id}
            className="flex flex-col rounded-2xl shadow-lg overflow-hidden bg-white transition-transform hover:-translate-y-1 duration-300"
          >
            <div className="flex-shrink-0">
              {item.image_url ? (
                <img
                  className="h-48 w-full object-cover"
                  src={item.image_url}
                  alt={item.title}
                />
              ) : (
                <div className="h-48 w-full bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-400">Sin imagen</span>
                </div>
              )}
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600">
                  {format(new Date(item.created_at), "d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </p>
                <Link to={`/noticias/${item.slug}`} className="block mt-2">
                  <p className="text-xl font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                    {item.title}
                  </p>
                  <p
                    className="mt-3 text-base text-slate-500 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No hay noticias publicadas aún.
        </div>
      )}
    </div>
  );
}
