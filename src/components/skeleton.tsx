function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-gray-200/90 ${className}`}
      aria-hidden
    />
  );
}

export function CircularProgress({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClass = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]',
  }[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`rounded-full border-indigo-200 border-t-indigo-600 animate-spin ${sizeClass} ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-9 w-14" />
        </div>
        <Shimmer className="h-12 w-12 rounded-xl shrink-0" />
      </div>
    </div>
  );
}

export function ExerciseStatSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/80 p-4 text-center ${className}`}
    >
      <Shimmer className="h-8 w-10 mx-auto rounded-lg" />
      <Shimmer className="h-3 w-14 mx-auto mt-2" />
    </div>
  );
}

export function CatalogTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-gray-50 last:border-0">
          <td className="px-6 py-4">
            <div className="flex items-start gap-3">
              <Shimmer className="h-10 w-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <Shimmer className="h-4 w-36 max-w-full" />
                <Shimmer className="h-3 w-28 max-w-full" />
              </div>
            </div>
          </td>
          <td className="px-4 py-4 hidden md:table-cell">
            <Shimmer className="h-4 w-full max-w-[200px]" />
            <Shimmer className="h-3 w-3/4 max-w-[160px] mt-2" />
          </td>
          <td className="px-4 py-4 text-center">
            <Shimmer className="h-6 w-16 rounded-full mx-auto" />
          </td>
          <td className="px-6 py-4">
            <div className="flex justify-end gap-1">
              <Shimmer className="h-8 w-8 rounded-lg" />
              <Shimmer className="h-8 w-8 rounded-lg" />
              <Shimmer className="h-8 w-8 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function ExerciseTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-gray-50 last:border-0">
          <td className="px-6 py-3.5">
            <Shimmer className="h-4 w-40 mb-2" />
            <Shimmer className="h-3 w-56 max-w-full" />
          </td>
          <td className="px-4 py-3.5">
            <Shimmer className="h-6 w-20 rounded-full" />
          </td>
          <td className="px-4 py-3.5">
            <Shimmer className="h-6 w-16 rounded-md" />
          </td>
          <td className="px-4 py-3.5">
            <div className="flex gap-1">
              <Shimmer className="h-5 w-14 rounded" />
              <Shimmer className="h-5 w-12 rounded" />
            </div>
          </td>
          <td className="px-4 py-3.5">
            <Shimmer className="h-5 w-20 rounded" />
          </td>
          <td className="px-4 py-3.5 text-center">
            <Shimmer className="h-6 w-16 rounded-full mx-auto" />
          </td>
          <td className="px-6 py-3.5">
            <div className="flex justify-end gap-1">
              <Shimmer className="h-8 w-8 rounded-lg" />
              <Shimmer className="h-8 w-8 rounded-lg" />
              <Shimmer className="h-8 w-8 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
