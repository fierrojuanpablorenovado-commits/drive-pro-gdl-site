import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <p className="text-8xl font-bold text-gray-200">404</p>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">Página no encontrada</h2>
      <p className="mt-2 text-gray-500">La página que buscas no existe.</p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-brand-800 text-white font-semibold rounded-lg hover:bg-brand-900"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
