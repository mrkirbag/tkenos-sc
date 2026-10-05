import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingBag, ArrowRight, X, Check } from 'lucide-react';
import { getProxiedImageUrl } from '@/lib/utils/images';
import { openCartDrawer, CART_OPEN_EVENT } from '@/lib/cart';
import './CartPushToast.css';

export interface PushToastData {
  id?: string;
  name: string;
  imageUrl?: string | null;
  quantity: number;
  price?: number;
}

interface CartPushToastProps {
  brandName?: string;
  onOpenCart: () => void;
}

export const PUSH_TOAST_EVENT = 'cart:push-notification';
export const PUSH_TOAST_STORAGE_KEY = 'cart:push_toast';

export function CartPushToast({ brandName = 'TKEÑOS.SC', onOpenCart }: CartPushToastProps) {
  const [toast, setToast] = useState<PushToastData | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const remainingTimeRef = useRef<number>(4000);
  const startTimeRef = useRef<number>(0);

  const closeToast = useCallback(() => {
    setIsClosing(true);
    window.setTimeout(() => {
      setToast(null);
      setIsClosing(false);
    }, 280);
  }, []);

  const startTimer = useCallback((duration: number) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    startTimeRef.current = Date.now();
    timerRef.current = window.setTimeout(() => {
      closeToast();
    }, duration);
  }, [closeToast]);

  const showToast = useCallback((data: PushToastData) => {
    setIsClosing(false);
    setToast(data);
    remainingTimeRef.current = 4000;
    startTimer(4000);
  }, [startTimer]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(800, remainingTimeRef.current - elapsed);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimer(remainingTimeRef.current);
  };

  const handleToastClick = (e: React.MouseEvent) => {
    // If click was on the close button, don't open the cart
    const target = e.target as HTMLElement;
    if (target.closest('.cart-push-toast__close')) {
      return;
    }
    e.preventDefault();
    closeToast();
    onOpenCart();
    openCartDrawer();
  };

  useEffect(() => {
    // Solo mostrar la notificación push en el menú principal / catálogo (no en /producto/[slug])
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path !== '/' && path !== '' && path !== '/index.html') {
        return;
      }
    }

    // Check sessionStorage on mount (e.g. redirected from /producto/[id])
    try {
      const raw = sessionStorage.getItem(PUSH_TOAST_STORAGE_KEY);
      if (raw) {
        sessionStorage.removeItem(PUSH_TOAST_STORAGE_KEY);
        const data = JSON.parse(raw);
        // Only show if created within the last 15 seconds
        if (data && data.name && Date.now() - (data.timestamp || 0) < 15000) {
          // Small delay so page transition feels natural
          const t = window.setTimeout(() => {
            showToast({
              id: data.id,
              name: data.name,
              imageUrl: data.imageUrl,
              quantity: data.quantity || 1,
              price: data.price,
            });
          }, 240);
          return () => window.clearTimeout(t);
        }
      }
    } catch {
      // Storage unavailable
    }
  }, [showToast]);

  useEffect(() => {
    // Listen for custom push event
    const handleEvent = (event: Event) => {
      // No mostrar en la página de producto individual (slug)
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/producto/')) {
        return;
      }
      const custom = event as CustomEvent<PushToastData>;
      if (custom.detail && custom.detail.name) {
        showToast(custom.detail);
      }
    };

    // Auto-close toast when drawer opens
    const handleCartOpen = () => {
      closeToast();
    };

    window.addEventListener(PUSH_TOAST_EVENT, handleEvent);
    window.addEventListener(CART_OPEN_EVENT, handleCartOpen);
    return () => {
      window.removeEventListener(PUSH_TOAST_EVENT, handleEvent);
      window.removeEventListener(CART_OPEN_EVENT, handleCartOpen);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [showToast, closeToast]);

  if (!toast) return null;

  return (
    <aside
      className={`cart-push-toast ${isClosing ? 'cart-push-toast--closing' : ''} ${
        isPaused ? 'cart-push-toast--paused' : ''
      }`}
      role="status"
      aria-live="polite"
      onClick={handleToastClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top micro-bar: App / Brand header */}
      <div className="cart-push-toast__header">
        <div className="cart-push-toast__brand">
          <span className="cart-push-toast__brand-dot" aria-hidden="true" />
          <span className="cart-push-toast__brand-name">{brandName}</span>
          <span className="cart-push-toast__brand-time">ahora</span>
        </div>
        <button
          type="button"
          className="cart-push-toast__close"
          onClick={(e) => {
            e.stopPropagation();
            closeToast();
          }}
          aria-label="Cerrar notificación"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Main notification body */}
      <div className="cart-push-toast__body">
        <div className="cart-push-toast__media">
          {toast.imageUrl ? (
            <img
              src={getProxiedImageUrl(toast.imageUrl)}
              alt={toast.name}
              className="cart-push-toast__img"
            />
          ) : (
            <div className="cart-push-toast__fallback-icon">
              <ShoppingBag size={20} strokeWidth={2} />
            </div>
          )}
          <span className="cart-push-toast__badge" aria-hidden="true">
            <Check size={10} strokeWidth={3} />
          </span>
        </div>

        <div className="cart-push-toast__content">
          <div className="cart-push-toast__title">¡Agregado al carrito!</div>
          <div className="cart-push-toast__desc">
            <span className="cart-push-toast__qty">{toast.quantity}x</span> {toast.name}
          </div>
        </div>

        <button
          type="button"
          className="cart-push-toast__action"
          data-cart-trigger="true"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            closeToast();
            onOpenCart();
            openCartDrawer();
          }}
        >
          <span>Ver pedido</span>
          <ArrowRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Bottom glowing progress bar indicator */}
      <div className="cart-push-toast__progress-track" aria-hidden="true">
        <div className="cart-push-toast__progress-bar" />
      </div>
    </aside>
  );
}
