import CartContent from '@/components/cart/CartContent';

export default function CarritoPage() {
  return (
    <div className="min-h-screen bg-background py-stack-lg">
      <div className="max-w-container-max mx-auto px-gutter py-stack-md">
        {/* Cart Header */}
        <div className="mb-stack-lg">
          <h1 className="font-h1 text-[48px] font-bold text-primary leading-[1.2] tracking-[-0.02em]">
            Tu Carrito de Compras
          </h1>
          <p className="text-on-surface-variant font-body-lg mt-2">
            Revisa tus artículos antes de proceder al pago seguro.
          </p>
        </div>

        <CartContent />
      </div>
    </div>
  );
}
