export default function EarningsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="mt-4">
          <div className="h-10 bg-gray-200 rounded-md w-40"></div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="ml-5 w-0 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="mt-4 h-4 bg-gray-100 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Withdraw Form Skeleton */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="h-10 bg-gray-200 rounded-md"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-md w-48"></div>
        </div>
        <div className="mt-3 h-3 bg-gray-100 rounded w-1/3"></div>
      </div>

      {/* Transactions Table Skeleton */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-100 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
