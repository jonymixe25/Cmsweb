import React, { useEffect, useState } from 'react';
import { Trash2, File as FileIcon, ExternalLink, Search, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function FileManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFiles = () => {
    setLoading(true);
    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        setFiles(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (name: string) => {
    if (confirm(`¿Estás seguro de eliminar el archivo "${name}"?`)) {
      await fetch(`/api/files/${name}`, { method: 'DELETE' });
      fetchFiles();
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Gestor de Archivos</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Buscar archivos..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Archivo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tamaño</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredFiles.map((file) => (
              <tr key={file.name} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      {file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img src={file.url} alt={file.name} className="h-full w-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                      ) : (
                        <FileIcon size={20} />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900 max-w-xs truncate" title={file.name}>
                        {file.name}
                      </div>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center mt-1">
                        Ver archivo <ExternalLink size={10} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {formatSize(file.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {format(new Date(file.createdAt), "d MMM, yyyy HH:mm", { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={file.url} download className="text-slate-600 hover:text-slate-900 mr-4 inline-block">
                    <Download size={18} />
                  </a>
                  <button onClick={() => handleDelete(file.name)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filteredFiles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No se encontraron archivos.</td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Cargando archivos...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
