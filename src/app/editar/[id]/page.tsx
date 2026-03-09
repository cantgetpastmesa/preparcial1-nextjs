"use client";

import { useState, useEffect, useCallback, FormEvent, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FaSave, FaTimes, FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";

const API_URL = "http://127.0.0.1:8080/api/authors";

interface FormErrors {
  name?: string;
  birthDate?: string;
  description?: string;
  image?: string;
}

export default function EditAuthorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    description: "",
    image: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    name: false,
    birthDate: false,
    description: false,
    image: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchAuthor = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      
      const response = await fetch(`${API_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar autor: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Formatear la fecha para el input type="date" (YYYY-MM-DD)
      const formattedDate = data.birthDate ? data.birthDate.split("T")[0] : "";
      
      setFormData({
        name: data.name || "",
        birthDate: formattedDate,
        description: data.description || "",
        image: data.image || "",
      });
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Error desconocido al cargar autor");
      console.error("Error fetching author:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAuthor();
  }, [fetchAuthor]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return "El nombre es obligatorio";
        }
        if (value.trim().length < 3) {
          return "El nombre debe tener al menos 3 caracteres";
        }
        break;
      
      case "birthDate":
        if (!value) {
          return "La fecha de nacimiento es obligatoria";
        }
        const date = new Date(value);
        const today = new Date();
        if (date > today) {
          return "La fecha de nacimiento no puede ser futura";
        }
        if (date.getFullYear() < 1900) {
          return "La fecha de nacimiento debe ser posterior a 1900";
        }
        break;
      
      case "description":
        if (!value.trim()) {
          return "La descripción es obligatoria";
        }
        if (value.trim().length < 10) {
          return "La descripción debe tener al menos 10 caracteres";
        }
        break;
      
      case "image":
        if (value && !value.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
          return "La URL de la imagen debe ser válida (jpg, jpeg, png, gif, webp)";
        }
        break;
    }
    return undefined;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });
    
    setErrors(newErrors);
    setTouched({
      name: true,
      birthDate: true,
      description: true,
      image: true,
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitError("Por favor, corrige los errores del formulario");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar autor: ${response.status}`);
      }

      setSubmitSuccess(true);
      
      setTimeout(() => {
        router.push("/authors");
      }, 2000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error desconocido al actualizar autor");
      console.error("Error updating author:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando datos del autor...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md text-center">
          <FaExclamationCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error al cargar autor
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{loadError}</p>
          <div className="flex gap-4">
            <button
              onClick={fetchAuthor}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Reintentar
            </button>
            <Link
              href="/authors"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md text-center">
          <FaCheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Autor actualizado exitosamente!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Redirigiendo a la lista de autores...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Editar Autor
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Modifica la información del autor
          </p>
        </div>

        {submitError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
          >
            <FaExclamationCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">Error</h3>
              <p className="text-red-700 dark:text-red-400">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="space-y-6">
            {/* Campo Nombre */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nombre <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.name && touched.name
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Ej: Gabriel García Márquez"
              />
              {errors.name && touched.name && (
                <p
                  id="name-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <FaExclamationCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Campo Fecha de Nacimiento */}
            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Fecha de Nacimiento <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={!!errors.birthDate}
                aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.birthDate && touched.birthDate
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.birthDate && touched.birthDate && (
                <p
                  id="birthDate-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <FaExclamationCircle className="w-4 h-4" />
                  {errors.birthDate}
                </p>
              )}
            </div>

            {/* Campo Descripción */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Descripción <span className="text-red-600">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                aria-required="true"
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "description-error" : undefined}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.description && touched.description
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Escribe una descripción sobre el autor..."
              />
              {errors.description && touched.description && (
                <p
                  id="description-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <FaExclamationCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Campo URL de Imagen */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                URL de Imagen
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.image}
                aria-describedby={errors.image ? "image-error" : undefined}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.image && touched.image
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {errors.image && touched.image && (
                <p
                  id="image-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <FaExclamationCircle className="w-4 h-4" />
                  {errors.image}
                </p>
              )}
              {formData.image && !errors.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Vista previa"
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-md"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  Guardar Cambios
                </>
              )}
            </button>
            
            <Link
              href="/authors"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-md"
            >
              <FaTimes className="w-4 h-4" />
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
