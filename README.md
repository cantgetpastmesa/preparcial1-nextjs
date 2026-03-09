# CRUD de Autores - Next.js

## Guía de Ejecución

### Requisitos Previos

1. **Backend en ejecución**: Debe estar ejecutando el repositorio `bookstore-back` en un contenedor Docker o en otra terminal. El backend debe estar disponible en `http://127.0.0.1:8080/api/authors`.

2. **Dependencias del proyecto**: Este proyecto utiliza Next.js 16.1.6 con pnpm como gestor de paquetes.

### Pasos de Instalación

1. Instalar las dependencias:
```bash
pnpm install
```

2. Ejecutar el servidor de desarrollo:
```bash
pnpm dev
```

3. Abrir el navegador en [http://localhost:3000](http://localhost:3000)

### Ejecutar Suite de Pruebas

Ejecutar todas las pruebas:
```bash
pnpm test
```

Ejecutar pruebas específicas del formulario de creación:
```bash
pnpm test src/app/crear/page.test.tsx
```

Las pruebas utilizan Jest 30.2.0, React Testing Library 16.3.2 y user-event 14.6.1 para simular interacciones de usuario.

---

## Reporte de Cambios

### Persistencia de Datos

La persistencia de datos entre rutas se logra mediante la integración directa con la API REST del backend Spring Boot. Cada componente realiza llamadas HTTP independientes usando `fetch()` al endpoint `http://127.0.0.1:8080/api/authors`, asegurando que los datos se obtengan desde el backend. Cada vista (`/authors`, `/crear`, `/editar/[id]`) ejecuta su propia lógica de obtención de datos mediante `useEffect` en el montaje del componente. Las operaciones CRUD (POST, PUT, DELETE) actualizan el backend directamente, y tras ejecutarse, redirigen al usuario o refrescan el estado local con `setAuthors()`, garantizando consistencia inmediata.

### Lógica de Filtrado

El filtrado en tiempo real se implementa mediante una variable de estado `searchTerm` que almacena el texto ingresado por el usuario. En cada renderizado, se aplica el método `Array.filter()` directamente sobre la lista de autores mediante la expresión `authors.filter(author => author.name.toLowerCase().includes(searchTerm.toLowerCase()))`. De esta forma se evita mantener un estado separado para los autores filtrados, aprovechando el re-renderizado automático de React cuando cambian `authors` o `searchTerm`. La búsqueda es insensible a mayúsculas y minúsculas mediante la conversión `toLowerCase()`, y dado el tamaño típico del conjunto de datos, el filtrado en cada ciclo de render mantiene un rendimiento óptimo sin impactar la experiencia del usuario.
