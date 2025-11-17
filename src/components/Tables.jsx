export function Table({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.accessor} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {(rows || []).map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((c) => (
                <td key={c.accessor} className="px-4 py-2 text-sm text-gray-700">
                  {c.render ? c.render(row[c.accessor], row) : row[c.accessor]}
                </td>
              ))}
            </tr>
          ))}
          {(!rows || rows.length === 0) && (
            <tr>
              <td className="px-4 py-6 text-center text-gray-400" colSpan={columns.length}>No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Section({ title, children, right }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  )
}
