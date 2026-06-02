import { Radar, ReceiptText } from "lucide-react";

export default function StatusCTA() {
  return (
    <section className="py-section-padding bg-primary-container relative">
      <div className="max-w-container-max mx-auto px-gutter text-center text-white">
        <h2 className="text-white mb-stack-md">¿Listo para restaurar tu tecnología?</h2>
        <p className="font-body-lg text-white/70 mb-stack-lg max-w-2xl mx-auto">
          Nuestros técnicos certificados están listos. Obtén una cotización instantánea para tu reparación o consulta el estado de tu servicio actual.
        </p>
        <div className="flex flex-col sm:flex-row gap-stack-md justify-center">
          <div className="bg-white/10 p-6 rounded-xl flex items-center gap-4 text-left border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
            <Radar className="text-secondary-container w-10 h-10" />
            <div>
              <p className="font-bold text-white">Rastreador de Reparaciones</p>
              <p className="text-sm text-white/60">Consulta por ID de Ticket</p>
            </div>
          </div>
          <div className="bg-white/10 p-6 rounded-xl flex items-center gap-4 text-left border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
            <ReceiptText className="text-secondary-container w-10 h-10" />
            <div>
              <p className="font-bold text-white">Cotización Instantánea</p>
              <p className="text-sm text-white/60">Estima costos de reparación ahora</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
