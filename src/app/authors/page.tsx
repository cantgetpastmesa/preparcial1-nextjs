"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"
import { FaEdit, FaTrash, FaPlus, FaExclamationTriangle, FaSearch, FaTimes } from "react-icons/fa";
import { Author } from "@/types/author";

const API_URL = "http://127.0.0.1:8080/api/authors";

export default function AuthorsPage() {
  /* Estados del componente */
  const [authors, setAuthors] = useState<Author[]>([]); // Lista completa de autores desde el backend
  const [error, setError] = useState<string | null>(null); // Error al cargar autores
  const [deleteError, setDeleteError] = useState<string | null>(null); // Error al eliminar autor
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda para filtrado

  /* Hook de efecto - Carga inicial de autores */
  useEffect(() => {
    fetchAuthors();
  }, []);

  /* Función para obtener autores del backend */
  const fetchAuthors = async () => {
    try {
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
    }
  };

  /* Función para eliminar un autor */
  const handleDelete = async (id: number) => {
    // Confirmación del usuario antes de eliminar
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

      // Actualizar la lista eliminando el autor del estado local
      setAuthors(authors.filter((author) => author.id !== id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error desconocido al eliminar autor");
      console.error("Error deleting author:", err);
    }
  };

  /* Filtrado en tiempo real - Calcula durante el renderizado sin estado adicional */
  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) // Case-insensitive
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado con título y botón de crear */}
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

        {/* Campo de búsqueda en tiempo real */}
        <div className="mb-6">
          <div className="relative">
            {/* Icono de búsqueda */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            
            {/* Input de búsqueda - Con ARIA */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar autores por nombre..."
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
              aria-label="Buscar autores" // ARIA: Etiqueta descriptiva para accesibilidad
            />
            
            {/* Botón para limpiar búsqueda - Solo visible cuando hay texto */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Limpiar búsqueda" // ARIA: Descripción de la acción del botón
              >
                <FaTimes className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
          
          {/* Contador de resultados filtrados */}
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Mostrando {filteredAuthors.length} de {authors.length} {filteredAuthors.length === 1 ? 'autor' : 'autores'}
            </p>
          )}
        </div>

        {/* Mensaje de error al cargar autores - Con ARIA para accesibilidad */}
        {error && (
          <div
            role="alert" // ARIA: Marca el elemento como alerta
            aria-live="assertive" // ARIA: Anuncia cambios inmediatamente a lectores de pantalla
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
          >
            <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
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

        {/* Mensaje de error al eliminar autor - Con ARIA */}
        {deleteError && (
          <div
            role="alert" // ARIA: Marca el elemento como alerta
            aria-live="assertive" // ARIA: Anuncia cambios inmediatamente
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
          >
            <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">Error al eliminar</h3>
              <p className="text-red-700 dark:text-red-400">{deleteError}</p>
            </div>
          </div>
        )}

        {/* Vista vacía - No hay autores en el sistema */}
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

        {/* Vista de sin coincidencias - Búsqueda sin resultados */}
        {!error && authors.length > 0 && filteredAuthors.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <FaSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron coincidencias
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No hay autores que coincidan con &quot;{searchTerm}&quot;
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FaTimes className="w-4 h-4" />
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Grid de tarjetas de autores - Resultados del filtrado */}
        {!error && filteredAuthors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuthors.map((author) => (
              
              /* Tarjeta individual de autor */
              <article
                key={author.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Sección de imagen del autor */}
                <div className="aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {author.image ? (
                    <Image
                      src={author.image}
                      width={500}
                      height={500}
                      alt={`Foto de ${author.name}`} // Alt text descriptivo para accesibilidad
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
                
                {/* Contenido de la tarjeta: información del autor */}
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

                  {/* Botones de acción: Editar y Eliminar - Con ARIA labels */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/editar/${author.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      aria-label={`Editar ${author.name}`} // ARIA: Descripción para lectores de pantalla
                    >
                      <FaEdit className="w-4 h-4" />
                      Editar
                    </Link>
                    
                    <button
                      onClick={() => author.id && handleDelete(author.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      aria-label={`Eliminar ${author.name}`} // ARIA: Descripción para lectores de pantalla
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
