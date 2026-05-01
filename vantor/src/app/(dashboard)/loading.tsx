export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-100 rounded w-24 mt-2" />
        </div>
        <div className="h-10 bg-gray-200 rounded-lg w-32" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 h-28">
            <div className="h-3 bg-gray-100 rounded w-20 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-12 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 h-64">
        <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 bg-gray-100 rounded w-24" />
              <div className="flex-1 h-5 bg-gray-100 rounded-full" />
              <div className="h-4 bg-gray-200 rounded w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
