import Button from '@/components/ui/Button';
import { Laptop, Cpu, Smartphone, Database, Calendar, ArrowRight } from 'lucide-react';

export default function Servicios() {
  const servicios = [
    { 
      title: 'Reparación de Laptops', 
      desc: 'Expertos en MacBook, Dell, HP y Lenovo. Cambio de pantallas, teclados y reparación de bisagras.',
      icon: Laptop
    },
    { 
      title: 'Micro-soldadura BGA', 
      desc: 'Reparación de placas base a nivel de componente. Recuperamos equipos mojados o con cortos.',
      icon: Cpu
    },
    { 
      title: 'Dispositivos Móviles', 
      desc: 'Cambio de cristal, baterías y puertos de carga para iPhone y Android.',
      icon: Smartphone
    },
    { 
      title: 'Recuperación de Datos', 
      desc: 'Extracción forense de información en discos duros dañados y SSDs.',
      icon: Database
    }
  ];

  return (
    <div className="bg-surface min-h-screen">
      <section className="bg-primary-container py-20 text-white">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h1 className="text-white mb-6">Servicios Técnicos Profesionales</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Contamos con laboratorio propio equipado con tecnología de punta para reparaciones de alta precisión.
          </p>
          <Button variant="accent" icon={Calendar}>Agendar Evaluación Gratis</Button>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicios.map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-all">
                <s.icon className="w-12 h-12 text-secondary mb-6" />
                <h3 className="text-primary text-xl font-bold mb-4">{s.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{s.desc}</p>
                <button className="text-secondary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                  Saber más <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Proceso */}
      <section className="bg-white py-20 border-t border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-gutter">
          <h2 className="text-center text-primary mb-16">Nuestro Proceso de Trabajo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {[
              { step: '01', title: 'Diagnóstico', desc: 'Evaluamos tu equipo en menos de 24h para identificar la falla exacta.' },
              { step: '02', title: 'Cotización', desc: 'Recibes un presupuesto detallado sin compromiso por WhatsApp o Email.' },
              { step: '03', title: 'Reparación', desc: 'Nuestros ingenieros proceden con la reparación usando repuestos originales.' }
            ].map((p, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="text-[64px] font-bold text-surface-container-highest mb-4">{p.step}</div>
                <h4 className="text-xl font-bold text-primary mb-2">{p.title}</h4>
                <p className="text-on-surface-variant">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
