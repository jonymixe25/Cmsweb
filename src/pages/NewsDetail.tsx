import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Noticia no encontrada");
        return res.json();
      })
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading)
    return <div className="text-center py-20 text-slate-500">Cargando...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!news) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/noticias"
        className="text-blue-600 hover:text-blue-800 font-medium mb-8 inline-block"
      >
        &larr; Volver a noticias
      </Link>

      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
        {news.title}
      </h1>

      <p className="text-sm font-medium text-slate-500 mb-8">
        Publicado el{" "}
        {format(new Date(news.created_at), "d 'de' MMMM, yyyy", { locale: es })}
      </p>

      {news.image_url && (
        <img
          src={news.image_url}
          alt={news.title}
          className="w-full h-auto rounded-2xl shadow-lg mb-8"
        />
      )}

      {news.video_url && (
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <iframe
            src={news.video_url}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-96 rounded-2xl shadow-lg"
          ></iframe>
        </div>
      )}

      <div
        className="prose prose-lg prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />
    </div>
  );
}
