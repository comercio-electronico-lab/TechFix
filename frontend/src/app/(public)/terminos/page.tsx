import React from 'react';
import { AlertTriangle, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen py-16 px-4 md:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Cabecera */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-400 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Volver al Inicio
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-on-surface dark:text-white leading-tight">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-sm text-on-surface-variant dark:text-slate-450">
            Última actualización: 29 de junio de 2026 • TechFix E-commerce & Soporte Técnico
          </p>
        </div>

        {/* Resumen */}
        <div className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm leading-relaxed text-sm text-on-surface-variant dark:text-slate-400 space-y-4">
          <p>
            Al ingresar al sitio web de <strong>TechFix</strong>, registrar un dispositivo, utilizar nuestro sistema de diagnóstico (PIG) o realizar compras, aceptas expresamente cumplir con estos términos y condiciones. Por favor, léelos con atención.
          </p>
        </div>

        {/* Clausula Antideepfakes */}
        <section className="bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 dark:border-amber-500/25 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-amber-800 dark:text-amber-400 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-500" />
            Cláusula Especial: Prohibición de Contenido Sintético y Deepfakes (Protección al Consumidor)
          </h2>
          <div className="text-sm text-on-surface-variant dark:text-slate-350 leading-relaxed space-y-3 font-medium">
            <p>
              Con el objetivo de garantizar la transparencia, honestidad comercial y proteger los derechos de los consumidores frente a la publicidad engañosa:
            </p>
            <p className="border-l-4 border-amber-500/50 pl-4 py-1 bg-amber-500/5 dark:bg-amber-500/10 italic rounded-r-md">
              &quot;Queda terminantemente prohibido a los usuarios, proveedores y técnicos cargar, publicar, compartir o adjuntar fotos, videos, testimonios o fichas técnicas de dispositivos que contengan <strong>contenido sintético, manipulado mediante Inteligencia Artificial Generativa o Deepfakes</strong> que falseen la calidad del producto, distorsionen el estado real de un equipo para cobrar garantías fraudulentas, o simulen resultados de rendimiento que no corresponden con la realidad física del repuesto.&quot;
            </p>
            <p>
              Cualquier infracción a esta cláusula resultará en:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-on-surface-variant dark:text-slate-400">
              <li>Cancelación inmediata de la cuenta del usuario en nuestra plataforma sin derecho a reclamo.</li>
              <li>Anulación de la <strong>Garantía Digital</strong> del servicio técnico contratado.</li>
              <li>Reporte de la actividad fraudulenta ante el organismo regulador correspondiente en el Perú (INDECOPI) y las autoridades competentes por falsificación de datos.</li>
            </ul>
          </div>
        </section>

        {/* Terminos Generales */}
        <section className="space-y-6 text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-on-surface dark:text-white tracking-tight">
              1. Condiciones del Servicio de Soporte Técnico
            </h2>
            <p>
              El pre-diagnóstico arrojado por el sistema interactivo PIG o por el chat conversacional con IA es únicamente una <strong>cotización estimada referencial</strong>. El precio final y el diagnóstico definitivo serán confirmados y cargados al sistema por el ingeniero electrónico asignado tras la evaluación presencial del hardware en el laboratorio.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-on-surface dark:text-white tracking-tight">
              2. Proceso de Pago y Seguridad Transaccional
            </h2>
            <p>
              Los pagos se realizan a través de la pasarela cifrada de <strong>Mercado Pago</strong>. Los usuarios aceptan los términos y políticas de Mercado Pago al momento de procesar una transacción. TechFix se reserva el derecho de cancelar transacciones que muestren indicios de fraude cibernético o cuya firma de webhook no sea verificada por nuestro servidor.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-on-surface dark:text-white tracking-tight">
              3. Garantías Digitales (Warranty)
            </h2>
            <p>
              TechFix otorga una garantía de hardware de 30 a 90 días (según el tipo de repuesto contratado: original, compatible o económico). La garantía se emite de forma digital y es verificable mediante un token hash único de forma pública. La cobertura queda invalidada si el equipo presenta daños físicos por líquidos, caídas, o si ha sido manipulado por técnicos externos a TechFix tras su retiro de nuestro laboratorio.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-on-surface dark:text-white tracking-tight">
              4. Propiedad Intelectual
            </h2>
            <p>
              Todos los logotipos, diseños, código del algoritmo del árbol PIG, y estructura lógica del sitio web son propiedad exclusiva de TechFix y están protegidos por las leyes de propiedad intelectual e industrial.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
