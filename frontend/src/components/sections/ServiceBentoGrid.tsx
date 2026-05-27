import React from 'react';
import { Laptop, Wrench, Database, Smartphone } from 'lucide-react';

const ServiceBentoGrid = () => {
  return (
    <section className="py-section-padding bg-surface">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-stack-lg">
          <h2 className="text-primary">Experiencia Técnica</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-stack-md h-auto md:h-150">
          {/* Item Grande */}
          <div className="md:col-span-2 md:row-span-2 bg-white p-stack-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between group hover:shadow-lg transition-all">
            <div>
              <div className="bg-surface-container-low w-16 h-16 rounded-xl flex items-center justify-center text-secondary mb-stack-md">
                <Laptop className="w-8 h-8" />
              </div>
              <h3 className="text-primary mb-2">Reparación de Laptops Empresariales</h3>
              <p className="text-on-surface-variant">Reparaciones autorizadas de placa base a nivel de componente para series Macbook, ThinkPad y Dell Precision.</p>
            </div>
            <img 
              alt="Reparación de Laptop" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJgM0XVvkuVt1SxY1SIN3aX8vZiXBTtFdYw4mwCLf_GVrXnoZas571zfMvC8tSIK6PyZUWd9EeBtqIkWrRmSe_zYD2mltbiY021JjP0bWmisa4IRUF_NXTSwv0x7pjiZFUn0cvxNUyuJBhzdQaruat1927G2omoXE7B59WEAL4Flo8rbIPrxFXb5wCezBoPMie8v8IAilg9LM7BfJ_Tp_gtaduBNMN3c_dxnvTdhWIS8vBarAx_RTiSDXsJze6s5puJAgHzethfbM"
              className="mt-stack-md rounded-lg object-cover h-48 w-full"
            />
          </div>

          {/* Item Horizontal */}
          <div className="md:col-span-2 bg-primary-container p-stack-md rounded-xl text-white flex items-center gap-stack-md group overflow-hidden">
            <div className="flex-1">
              <h3 className="text-white mb-2">Microsoldadura</h3>
              <p className="text-white/70 text-sm">Reparación especializada de SMD y BGA para fallas complejas de placas lógicas.</p>
            </div>
            <Wrench className="w-12 h-12 text-secondary-container opacity-50 group-hover:scale-110 transition-transform" />
          </div>

          {/* Items Pequeños */}
          <div className="bg-surface-container-high p-stack-md rounded-xl flex flex-col justify-center border border-secondary-container/20">
            <Database className="text-secondary mb-2 w-6 h-6" />
            <h4 className="font-bold text-primary">Recuperación de Datos</h4>
            <p className="text-xs text-on-surface-variant mt-1">Recuperación forense avanzada de unidades NVMe y HDD fallidas.</p>
          </div>

          <div className="bg-white p-stack-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-center">
            <Smartphone className="text-secondary mb-2 w-6 h-6" />
            <h4 className="font-bold text-primary">Cambio de Pantalla</h4>
            <p className="text-xs text-on-surface-variant mt-1">Pantallas certificadas OEM para todos los principales smartphones insignia.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceBentoGrid;