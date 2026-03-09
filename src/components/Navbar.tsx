"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaUsers, FaUserPlus } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Gestión de Autores
            </span>
          </Link>

          <div className="flex space-x-1">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaHome className="w-4 h-4" />
              <span>Inicio</span>
            </Link>

            <Link
              href="/authors"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/authors")
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaUsers className="w-4 h-4" />
              <span>Autores</span>
            </Link>

            <Link
              href="/crear"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/crear")
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaUserPlus className="w-4 h-4" />
              <span>Crear Autor</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
