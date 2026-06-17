/**
 * Muestra un HUD (Heads-Up Display) centrado y elegante de confirmación
 * cuando un producto se agrega al carrito.
 * Es completamente click-through (pointer-events: none) para no interferir con la navegación.
 */
export function showCartHud(productName: string) {
  if (typeof window === 'undefined') return;

  // Remover cualquier HUD activo previo para evitar duplicaciones
  const existingHud = document.getElementById('cart-hud-overlay');
  if (existingHud) {
    existingHud.remove();
  }

  // Crear contenedor del HUD
  const hud = document.createElement('div');
  hud.id = 'cart-hud-overlay';
  
  // Estilos de diseño esmerilado (glassmorphism) y centrado
  hud.style.position = 'fixed';
  hud.style.top = '50%';
  hud.style.left = '50%';
  hud.style.transform = 'translate(-50%, -50%) scale(0.85)';
  hud.style.backgroundColor = 'rgba(15, 23, 42, 0.88)'; // Slate 900
  hud.style.backdropFilter = 'blur(10px)';
  hud.style.color = '#ffffff';
  hud.style.padding = '20px 28px';
  hud.style.borderRadius = '20px';
  hud.style.zIndex = '99999';
  hud.style.display = 'flex';
  hud.style.flexDirection = 'column';
  hud.style.alignItems = 'center';
  hud.style.justifyContent = 'center';
  hud.style.gap = '10px';
  hud.style.pointerEvents = 'none'; // PERMITE SEGUIR HACIENDO CLICK EN LA PANTALLA
  hud.style.opacity = '0';
  hud.style.transition = 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'; // Entrada elástica y agradable
  hud.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
  hud.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  hud.style.maxWidth = '250px';
  hud.style.textAlign = 'center';

  // SVG de checkmark animado en sky-400
  const checkSvg = `
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" stroke="rgba(56, 189, 248, 0.15)" stroke-width="4" />
      <circle cx="24" cy="24" r="22" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" stroke-dasharray="138" stroke-dashoffset="138" style="animation: draw-circle 0.35s ease-out forwards;" />
      <path d="M14 24L21 31L34 18" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="30" stroke-dashoffset="30" style="animation: draw-check 0.25s 0.15s ease-out forwards;" />
    </svg>
  `;

  // Registrar animaciones de trazado en el head si no existen
  if (!document.getElementById('hud-keyframes')) {
    const style = document.createElement('style');
    style.id = 'hud-keyframes';
    style.innerHTML = `
      @keyframes draw-circle {
        to { stroke-dashoffset: 0; }
      }
      @keyframes draw-check {
        to { stroke-dashoffset: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Contenido interno del HUD
  hud.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 2px;">
      ${checkSvg}
    </div>
    <div style="font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #38bdf8; font-family: sans-serif;">
      ¡Agregado!
    </div>
    <div style="font-size: 11px; font-weight: 600; opacity: 0.85; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 190px; font-family: sans-serif; color: #cbd5e1;">
      ${productName}
    </div>
  `;

  document.body.appendChild(hud);

  // Forzar reflow y activar entrada
  hud.offsetHeight;
  hud.style.opacity = '1';
  hud.style.transform = 'translate(-50%, -50%) scale(1)';

  // Mantener visible y luego realizar la transición de salida rápida
  setTimeout(() => {
    hud.style.transition = 'all 0.18s ease-in';
    hud.style.opacity = '0';
    hud.style.transform = 'translate(-50%, -50%) scale(0.9)';
    
    setTimeout(() => {
      hud.remove();
    }, 180);
  }, 750); // Duración de visibilidad de 750ms
}
