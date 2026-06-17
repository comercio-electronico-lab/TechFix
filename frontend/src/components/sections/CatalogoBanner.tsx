export default function CatalogoBanner() {
  return (
    <section className="bg-gradient-to-r from-[#04142c] via-[#0b61a1] to-[#031024] dark:from-[#010512] dark:via-[#061533] dark:to-[#01030d] py-16 text-white shadow-2xl relative overflow-hidden border-b border-white/10 dark:border-slate-900">
      {/* Luces de fondo y resplandores */}
      <div className="absolute -top-12 -left-12 w-80 h-80 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 right-0 w-96 h-96 bg-blue-500/20 dark:bg-[#00bcff]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="max-w-container-max mx-auto px-6 md:px-gutter relative z-10">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-white/10 border border-white/20 dark:bg-sky-500/10 dark:border-sky-500/20 text-white dark:text-sky-300 px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-black/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Tienda Oficial TechFix
        </span>
        <h1 className="text-3xl md:text-5xl font-h1 font-bold mt-4 mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-sky-300">
          Catálogo de Hardware
        </h1>
        <p className="text-sky-100/75 dark:text-slate-350 text-xs md:text-sm max-w-xl leading-relaxed font-medium">
          Encuentra repuestos originales de grado profesional y herramientas certificadas para laboratorios de micro-soldadura. Garantía y soporte técnico especializado.
        </p>
      </div>
    </section>
  );
}

