import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function ManageNews() {
  const [news, setNews] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentForm, setCurrentForm] = useState<any>({
    id: null,
    title: "",
    slug: "",
    content: "",
    video_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchNews = () => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = currentForm.id ? `/api/news/${currentForm.id}` : "/api/news";
    const method = currentForm.id ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("title", currentForm.title);
    formData.append("slug", currentForm.slug);
    formData.append("content", currentForm.content);
    formData.append("video_url", currentForm.video_url || "");
    if (currentForm.existing_image_url) {
      formData.append("existing_image_url", currentForm.existing_image_url);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch(url, {
      method,
      body: formData,
    });

    if (res.ok) {
      setIsEditing(false);
      setImageFile(null);
      fetchNews();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const handleEdit = async (id: number) => {
    const res = await fetch(`/api/news/${news.find((n) => n.id === id)?.slug}`);
    const data = await res.json();
    setCurrentForm({
      ...data,
      existing_image_url: data.image_url,
    });
    setImageFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta noticia?")) {
      await fetch(`/api/news/${id}`, { method: "DELETE" });
      fetchNews();
    }
  };

  const openNewForm = () => {
    setCurrentForm({
      id: null,
      title: "",
      slug: "",
      content: "",
      video_url: "",
    });
    setImageFile(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {currentForm.id ? "Editar Noticia" : "Nueva Noticia"}
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={currentForm.title}
              onChange={(e) =>
                setCurrentForm({ ...currentForm, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Slug (URL)
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={currentForm.slug}
              onChange={(e) =>
                setCurrentForm({ ...currentForm, slug: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Imagen Principal
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Subir un archivo</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  PNG, JPG, GIF hasta 10MB
                </p>
                {imageFile && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    Archivo seleccionado: {imageFile.name}
                  </p>
                )}
                {!imageFile && currentForm.existing_image_url && (
                  <p className="text-sm text-blue-600 font-medium mt-2">
                    Imagen actual: {currentForm.existing_image_url}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL de Video (YouTube, Vimeo, etc.)
            </label>
            <input
              type="url"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.youtube.com/embed/..."
              value={currentForm.video_url || ""}
              onChange={(e) =>
                setCurrentForm({ ...currentForm, video_url: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contenido (HTML)
            </label>
            <textarea
              required
              rows={15}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              value={currentForm.content}
              onChange={(e) =>
                setCurrentForm({ ...currentForm, content: e.target.value })
              }
            />
            <p className="text-xs text-slate-500 mt-2">
              Puedes usar etiquetas HTML aquí.
            </p>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Noticias</h1>
        <button
          onClick={openNewForm}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nueva Noticia
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {format(new Date(item.created_at), "d MMM, yyyy", {
                    locale: es,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No hay noticias creadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
