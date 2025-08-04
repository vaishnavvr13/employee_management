import React from 'react';

interface TableProps {
  data: Array<Record<string, unknown>>;
  onDelete?: (id: string | number) => void;
}

const Table: React.FC<TableProps> = ({ data, onDelete }: TableProps) => {
  if (!data.length) return <div>No data</div>;
  const headers = Object.keys(data[0]);
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map((header: string) => (
            <th key={header} style={{ border: '1px solid #ccc', padding: 8 }}>{header}</th>
          ))}
          {onDelete && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row: Record<string, unknown>, i: number) => (
          <tr key={i}>
            {headers.map((header: string) => (
              <td key={header} style={{ border: '1px solid #ccc', padding: 8 }}>{String(row[header])}</td>
            ))}
            {onDelete && (
              <td>
                <button onClick={() => onDelete((row.id as string | number))} style={{ color: 'white', background: 'red', border: 'none', borderRadius: 4, padding: '4px 8px' }}>
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table; 