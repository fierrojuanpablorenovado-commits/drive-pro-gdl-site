import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <p className="text-6xl font-bold text-gray-200">404</p>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">Página no encontrada</h2>
      <p className="mt-2 text-sm text-gray-500">La página que buscas no existe o fue movida.</p>
      <Link
        href="/dashboard"
        className="mt-6 px-4 py-2.5 bg-brand-800 text-white text-sm font-semibold rounded-lg hover:bg-brand-900"
      >
        Ir al dashboard
      </Link>
    </div>
  );
}
