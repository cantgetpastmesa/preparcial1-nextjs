"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaPlus, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { Author } from "@/types/author";

const API_URL = "http://127.0.0.1:8080/api/authors";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Error al cargar autores: ${response.status}`);
      }
      
      const data = await response.json();
      setAuthors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar autores");
      console.error("Error fetching authors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este autor?")) {
      return;
    }

    try {
      setDeleteError(null);
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar autor: ${response.status}`);
      }

      // Actualizar la lista eliminando el autor
      setAuthors(authors.filter((author) => author.id !== id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error desconocido al eliminar autor");
      console.error("Error deleting author:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando autores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Lista de Autores
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Mira, edita, añade o elimina autores.
            </p>
          </div>
          <Link
            href="/crear"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <FaPlus className="w-4 h-4" />
            Nuevo Autor
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
          >
            <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">Error</h3>
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={fetchAuthors}
                className="mt-2 text-sm underline text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {deleteError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
          >
            <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">Error al eliminar</h3>
              <p className="text-red-700 dark:text-red-400">{deleteError}</p>
            </div>
          </div>
        )}

        {!error && authors.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <FaExclamationTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay autores
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comienza agregando tu primer autor a la plataforma
            </p>
            <Link
              href="/crear"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              Crear Primer Autor
            </Link>
          </div>
        )}

        {!error && authors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <article
                key={author.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {author.image ? (
                    <img
                      src={author.image}
                      alt={`Foto de ${author.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x300?text=Sin+Imagen";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {author.name}
                  </h2>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Nacimiento: {new Date(author.birthDate).toLocaleDateString("es-ES")}
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {author.description}
                  </p>

                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/editar/${author.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      aria-label={`Editar ${author.name}`}
                    >
                      <FaEdit className="w-4 h-4" />
                      Editar
                    </Link>
                    
                    <button
                      onClick={() => author.id && handleDelete(author.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      aria-label={`Eliminar ${author.name}`}
                    >
                      <FaTrash className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
