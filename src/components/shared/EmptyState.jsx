export default function EmptyState({ icon = '📭', title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="text-6xl mb-4 opacity-80">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2 font-heading">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-sm mb-5">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
