export default function CatalogoBanner() {
  return (
    <section className="bg-primary py-12 text-white shadow-inner relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="max-w-container-max mx-auto px-gutter relative z-10">
        <span className="text-[10px] font-bold bg-white/10 border border-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Tienda Oficial TechFix
        </span>
        <h1 className="text-3xl md:text-4xl font-h1 font-bold mt-3 mb-2">Catálogo de Hardware</h1>
        <p className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed">
          Encuentra repuestos originales de grado profesional y herramientas certificadas para laboratorios de micro-soldadura.
        </p>
      </div>
    </section>
  );
}
