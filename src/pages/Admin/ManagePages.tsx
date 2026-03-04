import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

export function ManagePages() {
  const [pages, setPages] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentForm, setCurrentForm] = useState({
    id: null,
    title: "",
    slug: "",
    content: "",
  });

  const fetchPages = () => {
    fetch("/api/pages")
      .then((res) => res.json())
      .then((data) => setPages(data));
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = currentForm.id ? `/api/pages/${currentForm.id}` : "/api/pages";
    const method = currentForm.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentForm),
    });

    if (res.ok) {
      setIsEditing(false);
      fetchPages();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const handleEdit = async (id: number) => {
    const res = await fetch(
      `/api/pages/${pages.find((p) => p.id === id)?.slug}`,
    );
    const data = await res.json();
    setCurrentForm(data);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta página?")) {
      await fetch(`/api/pages/${id}`, { method: "DELETE" });
      fetchPages();
    }
  };

  const openNewForm = () => {
    setCurrentForm({ id: null, title: "", slug: "", content: "" });
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {currentForm.id ? "Editar Página" : "Nueva Página"}
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
        <h1 className="text-3xl font-bold text-slate-900">Páginas</h1>
        <button
          onClick={openNewForm}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nueva Página
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
                Slug
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {page.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  /{page.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(page.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No hay páginas creadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
