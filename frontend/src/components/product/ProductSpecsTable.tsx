import React from 'react';

interface ProductSpecsTableProps {
  specs: {
    processor: string;
    graphics: string;
    ram: string;
    storage: string;
  };
}

export default function ProductSpecsTable({ specs }: ProductSpecsTableProps) {
  const specRows = [
    { label: 'Procesador', value: specs.processor },
    { label: 'Gráficos', value: specs.graphics },
    { label: 'Memoria', value: specs.ram },
    { label: 'Almacenamiento', value: specs.storage },
  ];

  return (
    <section className="mt-section-padding pt-stack-lg">
      <h2 className="text-[32px] font-bold text-primary dark:text-sky-400 mb-8 border-l-4 border-secondary dark:border-sky-500 pl-6">Especificaciones Técnicas</h2>
      <div className="overflow-hidden border border-outline-variant/30 dark:border-slate-800 rounded-xl transition-colors">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary dark:bg-slate-900 text-white dark:text-sky-400">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Característica</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Detalle Técnico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 dark:divide-slate-800/60">
            {specRows.map((row, idx) => (
              <tr 
                key={row.label} 
                className={idx % 2 === 0 ? 'bg-surface-container-low dark:bg-slate-900/30' : 'bg-white dark:bg-slate-950'}
              >
                <td className="px-6 py-4 font-bold text-primary dark:text-sky-400 w-1/3 text-sm">{row.label}</td>
                <td className="px-6 py-4 text-on-surface-variant dark:text-slate-350 text-sm">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
