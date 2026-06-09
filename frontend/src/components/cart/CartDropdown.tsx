"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartDropdown = () => {
  const { items, totalItems, subtotal, removeItem, updateQuantity, lastAddedItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (lastAddedItem) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  }, [lastAddedItem]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`group transition-all duration-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer relative ${
          isAnimating ? 'animate-cart-bounce' : ''
        } ${isOpen ? 'bg-slate-100 dark:bg-white/10' : ''}`}
        aria-label="Carrito de compras"
      >
        <ShoppingCart className="w-4.5 h-4.5 text-slate-650 dark:text-slate-355 group-hover:text-slate-955 dark:group-hover:text-sky-400 transition-colors" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-lg animate-badge-pulse">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-3 w-80 bg-white dark:bg-surface-variant border border-outline-variant/20 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2"
        >
          {items.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto text-on-surface-variant/30 mb-3" />
              <p className="text-on-surface-variant text-sm font-medium">
                Tu carrito está vacío
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-4 border-b border-outline-variant/10 hover:bg-primary-container/5 transition-colors group"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-on-surface line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-outline-variant/20 rounded transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            updateQuantity(item.id, 1);
                            triggerAnimation();
                          }}
                          className="p-1 hover:bg-outline-variant/20 rounded transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-error/20 hover:text-error rounded transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-outline-variant/20 bg-primary-container/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-on-surface">Subtotal:</span>
                  <span className="font-bold text-secondary text-lg">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/carrito"
                  onClick={() => setIsOpen(false)}
                  className="w-full block text-center bg-secondary text-white font-bold py-2.5 rounded-lg hover:bg-secondary-container transition-all mb-2"
                >
                  Ver carrito
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full block text-center bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary-container transition-all"
                >
                  Proceder a compra
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
