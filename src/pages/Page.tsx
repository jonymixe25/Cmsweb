import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function Page() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pages/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Página no encontrada");
        return res.json();
      })
      .then((data) => {
        setPage(data);
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
  if (!page) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">
        {page.title}
      </h1>
      <div
        className="prose prose-lg prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
