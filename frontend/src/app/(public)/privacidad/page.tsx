import React from 'react';
import { ShieldCheck, Eye, RefreshCw, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
            Política de Privacidad
          </h1>
          <p className="text-sm text-on-surface-variant dark:text-slate-450">
            Última actualización: 29 de junio de 2026 • Conforme a la Ley N° 29733 (Perú) y GDPR
          </p>
        </div>

        {/* Introducción */}
        <div className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm leading-relaxed text-sm text-on-surface-variant dark:text-slate-400 space-y-4">
          <p>
            En <strong>TechFix</strong>, la privacidad y seguridad de tus datos personales es nuestra máxima prioridad. Esta política detalla cómo recopilamos, procesamos, almacenamos y protegemos tus datos cuando usas nuestro e-commerce y servicios de pre-diagnóstico y reserva de reparaciones.
          </p>
        </div>

        {/* Derechos ARCO */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-on-surface dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary dark:text-sky-400" />
            Derechos ARCO (Ley de Protección de Datos Personales N° 29733)
          </h2>
          <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
            De acuerdo con la legislación peruana, tienes derecho a controlar tus datos personales mediante el ejercicio de tus derechos ARCO. Te explicamos cómo nuestra plataforma garantiza cada uno de ellos directamente en nuestro código y base de datos:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-outline-variant/50 dark:border-slate-800 p-5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-primary dark:text-sky-400 font-bold text-sm">
                <Eye className="w-4 h-4" />
                <span>Acceso y Rectificación</span>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed">
                Puedes visualizar en tiempo real toda tu información personal, historial de equipos y pedidos desde tu <strong>Dashboard de Cliente</strong>. Cualquier rectificación de nombres, contraseñas o teléfonos se actualiza al instante en la base de datos PostgreSQL mediante nuestro endpoint seguro <code>PUT /api/user/profile</code>.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-outline-variant/50 dark:border-slate-800 p-5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-primary dark:text-sky-400 font-bold text-sm">
                <Trash2 className="w-4 h-4" />
                <span>Cancelación (Eliminación)</span>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed">
                Tienes el derecho de solicitar la eliminación total de tus datos personales. En nuestro backend (Go + GORM), implementamos <strong>Soft Deletes</strong> (campo <code>deleted_at</code>) para resguardar transacciones comerciales pasadas exigidas por ley, y la eliminación física/anonimización automática de datos de perfil tras 30 días del cierre de cuenta.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-outline-variant/50 dark:border-slate-800 p-5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-primary dark:text-sky-400 font-bold text-sm">
                <RefreshCw className="w-4 h-4" />
                <span>Oposición</span>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed">
                Puedes oponerte al uso de tus datos para fines publicitarios (como recordatorios de mantenimiento preventivo o promociones). Puedes revocar este consentimiento desactivando las notificaciones en tu perfil o rechazando las cookies de marketing en nuestro banner.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-outline-variant/50 dark:border-slate-800 p-5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-primary dark:text-sky-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Portabilidad</span>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed">
                Toda la información del historial de tus reparaciones y garantías puede ser descargada en formato PDF / Proforma directamente desde el timeline de seguimiento de tu orden, garantizando la portabilidad de tu ficha técnica.
              </p>
            </div>
          </div>
        </section>

        {/* Recopilación de datos */}
        <section className="space-y-4 text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
          <h2 className="text-xl font-bold text-on-surface dark:text-white tracking-tight">
            1. Datos que recopilamos y procesamos
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Datos de Cuenta:</strong> Nombre, dirección de correo electrónico, contraseña cifrada con <code>bcrypt</code> (nunca almacenada en texto plano).</li>
            <li><strong>Datos de Equipos:</strong> Tipo de dispositivo, marca, modelo y número de serie para el registro en el inventario de reparaciones.</li>
            <li><strong>Datos del Diagnóstico (PIG/IA):</strong> Respuestas seleccionadas en el árbol interactivo y transcripción del diagnóstico conversacional con IA.</li>
            <li><strong>Datos de Pago:</strong> La información de tu tarjeta es procesada de forma segura y directa por <strong>Mercado Pago</strong> (cumpliendo estándares PCI-DSS). TechFix solo almacena el token temporal (<code>mp_token</code>) y la respuesta del estado de la transacción.</li>
          </ul>
        </section>

        {/* Cookies y Terceros */}
        <section className="space-y-4 text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
          <h2 className="text-xl font-bold text-on-surface dark:text-white tracking-tight">
            2. Servicios de Terceros e Transferencia de Datos
          </h2>
          <p>
            Para garantizar el correcto funcionamiento del e-commerce, transferimos datos cifrados a los siguientes proveedores externos bajo contratos de confidencialidad estrictos:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Mercado Pago:</strong> Procesamiento de pasarela de pagos.</li>
            <li><strong>OpenAI (ChatGPT API):</strong> Para el análisis de fallas en el módulo de diagnóstico por IA (los datos se envían anonimizados, sin relacionarse al perfil del usuario).</li>
            <li><strong>Google Analytics 4 & Hotjar:</strong> Medición estadística del rendimiento del MVP (solo activados bajo consentimiento expreso en el banner de cookies).</li>
          </ul>
        </section>

        {/* Contacto */}
        <section className="space-y-4 text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed border-t border-outline-variant/20 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-on-surface dark:text-white tracking-tight">
            3. Contacto para la Protección de Datos
          </h2>
          <p>
            Para ejercer cualquiera de tus derechos ARCO o solicitar asistencia, puedes escribir a nuestro Delegado de Protección de Datos al correo: <a href="mailto:privacidad@techfix.pe" className="text-primary dark:text-sky-400 hover:underline">privacidad@techfix.pe</a> o visitarnos en nuestra sucursal de Ayacucho.
          </p>
        </section>
      </div>
    </div>
  );
}
