import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";

export function Settings() {
  const [settings, setSettings] = useState<any>({
    siteName: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#1d4ed8",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) {
      alert(
        "Configuración guardada correctamente. Recarga la página para ver los cambios de color.",
      );
    } else {
      alert("Error al guardar la configuración");
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Configuración del Sitio
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200 space-y-8"
      >
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4 border-b border-slate-200 pb-2">
            General
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre del Sitio
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.siteName || ""}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4 border-b border-slate-200 pb-2">
            Apariencia (Colores)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Color Principal
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  className="h-10 w-10 rounded border border-slate-300 cursor-pointer"
                  value={settings.primaryColor || "#3b82f6"}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  value={settings.primaryColor || "#3b82f6"}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Color Secundario
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  className="h-10 w-10 rounded border border-slate-300 cursor-pointer"
                  value={settings.secondaryColor || "#1d4ed8"}
                  onChange={(e) =>
                    setSettings({ ...settings, secondaryColor: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  value={settings.secondaryColor || "#1d4ed8"}
                  onChange={(e) =>
                    setSettings({ ...settings, secondaryColor: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4 border-b border-slate-200 pb-2">
            Redes Sociales
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                URL de Facebook
              </label>
              <input
                type="url"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://facebook.com/..."
                value={settings.facebookUrl || ""}
                onChange={(e) =>
                  setSettings({ ...settings, facebookUrl: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                URL de Twitter
              </label>
              <input
                type="url"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://twitter.com/..."
                value={settings.twitterUrl || ""}
                onChange={(e) =>
                  setSettings({ ...settings, twitterUrl: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                URL de Instagram
              </label>
              <input
                type="url"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://instagram.com/..."
                value={settings.instagramUrl || ""}
                onChange={(e) =>
                  setSettings({ ...settings, instagramUrl: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
          >
            <Save size={20} className="mr-2" />
            {saving ? "Guardando..." : "Guardar Configuración"}
          </button>
        </div>
      </form>
    </div>
  );
}
