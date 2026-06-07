export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-[3px]' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-blue-500/30 border-t-blue-500 rounded-full animate-spin`} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0f1e]">
      <div className="text-center">
        <div className="w-16 h-16 border-[3px] border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <div className="text-blue-400 font-heading font-semibold text-lg">Digital Marmat</div>
        <p className="text-gray-500 text-sm mt-1">Loading workspace...</p>
      </div>
    </div>
  );
}

export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="bg-[#111827] rounded-xl p-4 border border-gray-800 animate-pulse">
      <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-3" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div key={i} className={`h-3 bg-gray-700/50 rounded mb-2 ${i % 2 === 0 ? 'w-1/2' : 'w-2/3'}`} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-3 bg-[#111827] rounded-lg border border-gray-800">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-3 bg-gray-700/50 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
