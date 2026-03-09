import Link from "next/link";
import { FaUsers, FaUserPlus} from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-4xl px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Parcial 1 Next.js - ISIS 3710
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Frontend (y sus pruebas) para el CRUD para el bookstore-back
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            href="/authors"
            className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all p-8 border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FaUsers className="w-10 h-10 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Ver Autores
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Mira, edita, añade o elimina autores
              </p>
            </div>
          </Link>

          <Link
            href="/crear"
            className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all p-8 border-2 border-transparent hover:border-green-500"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full">
                <FaUserPlus className="w-10 h-10 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Crear Autor
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Agrega un nuevo autor al sistema
              </p>
            </div>
          </Link>
        </div>
        <div className="mt-12 pt-8 text-center">
          <p className=" text-gray-600 dark:text-gray-400">
            Desarrollado por Felipe A. Mesa N. - 202123007
          </p>
        </div>
      </main>
    </div>
  );
}
