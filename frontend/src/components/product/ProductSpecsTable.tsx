export default function ProductSpecsTable() {
  return (
    <section className="mt-12 pt-8 border-t border-outline-variant/20 dark:border-outline/10">
      <h2 className="text-xl md:text-2xl font-black text-on-surface dark:text-white mb-6 border-l-4 border-secondary dark:border-[#00bcff] pl-4 tracking-tight">
        Especificaciones Técnicas
      </h2>
      <div className="overflow-hidden bg-white dark:bg-[#061533]/45 border border-outline-variant/60 dark:border-outline/20 backdrop-blur-xl rounded-2xl shadow-md transition-all duration-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-55/70 dark:bg-slate-950/70 border-b border-outline-variant/30 dark:border-outline/15">
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-on-surface dark:text-sky-300 w-1/3">
                Característica
              </th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-on-surface dark:text-sky-300">
                Detalle Técnico
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15 dark:divide-outline/10">
            <tr className="bg-white/40 dark:bg-transparent hover:bg-slate-50/50 dark:hover:bg-sky-950/10 transition-colors">
              <td className="px-6 py-4 font-bold text-primary dark:text-[#00bcff] text-xs uppercase tracking-wider">
                Procesador
              </td>
              <td className="px-6 py-4 text-on-surface-variant dark:text-slate-350 text-xs font-semibold">
                Intel® Core™ i9-14900HX (24 Cores, 32 Threads, up to 5.8 GHz)
              </td>
            </tr>
            <tr className="bg-slate-50/20 dark:bg-slate-950/20 hover:bg-slate-50/50 dark:hover:bg-sky-950/10 transition-colors">
              <td className="px-6 py-4 font-bold text-primary dark:text-[#00bcff] text-xs uppercase tracking-wider">
                Gráficos
              </td>
              <td className="px-6 py-4 text-on-surface-variant dark:text-slate-350 text-xs font-semibold">
                NVIDIA® GeForce RTX™ 4080 Laptop GPU, 12GB GDDR6, 175W TGP
              </td>
            </tr>
            <tr className="bg-white/40 dark:bg-transparent hover:bg-slate-50/50 dark:hover:bg-sky-950/10 transition-colors">
              <td className="px-6 py-4 font-bold text-primary dark:text-[#00bcff] text-xs uppercase tracking-wider">
                Memoria
              </td>
              <td className="px-6 py-4 text-on-surface-variant dark:text-slate-350 text-xs font-semibold">
                64GB (2x32GB) DDR5 5600MHz SO-DIMM (Expandible a 128GB)
              </td>
            </tr>
            <tr className="bg-slate-50/20 dark:bg-slate-950/20 hover:bg-slate-50/50 dark:hover:bg-sky-950/10 transition-colors">
              <td className="px-6 py-4 font-bold text-primary dark:text-[#00bcff] text-xs uppercase tracking-wider">
                Almacenamiento
              </td>
              <td className="px-6 py-4 text-on-surface-variant dark:text-slate-350 text-xs font-semibold">
                2TB PCIe Gen4 x4 NVMe M.2 SSD (Segundo slot M.2 disponible)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

