export default function ProductSpecsTable() {
  return (
    <section className="mt-section-padding pt-stack-lg">
      <h2 className="text-[32px] font-bold text-primary mb-8 border-l-4 border-secondary pl-6">Especificaciones Técnicas</h2>
      <div className="overflow-hidden border border-outline-variant/30 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Característica</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Detalle Técnico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            <tr className="bg-surface-container-low">
              <td className="px-6 py-4 font-bold text-primary w-1/3 text-sm">Procesador</td>
              <td className="px-6 py-4 text-on-surface-variant text-sm">Intel® Core™ i9-14900HX (24 Cores, 32 Threads, up to 5.8 GHz)</td>
            </tr>
            <tr className="bg-white">
              <td className="px-6 py-4 font-bold text-primary text-sm">Gráficos</td>
              <td className="px-6 py-4 text-on-surface-variant text-sm">NVIDIA® GeForce RTX™ 4080 Laptop GPU, 12GB GDDR6, 175W TGP</td>
            </tr>
            <tr className="bg-surface-container-low">
              <td className="px-6 py-4 font-bold text-primary text-sm">Memoria</td>
              <td className="px-6 py-4 text-on-surface-variant text-sm">64GB (2x32GB) DDR5 5600MHz SO-DIMM (Expandible a 128GB)</td>
            </tr>
            <tr className="bg-white">
              <td className="px-6 py-4 font-bold text-primary text-sm">Almacenamiento</td>
              <td className="px-6 py-4 text-on-surface-variant text-sm">2TB PCIe Gen4 x4 NVMe M.2 SSD (Segundo slot M.2 disponible)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
