import Home from './home';
import React, { useState, useEffect, useRef } from 'react';
import './styles/app.css';

import ProductList from './products/productList';
import Cart from './products/cart';
import Checkout from './products/checkout';
import About from './about';

/**
 * Helper to safely build a public asset URL in all environments (dev, subpath, gh-pages).
 * Falls back to absolute root for CRA dev server if PUBLIC_URL is empty.
 */
const publicUrl = (path) => {
  const base = process.env.PUBLIC_URL;
  if (base && base !== '/') return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  return path.startsWith('/') ? path : `/${path}`;
};

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [view, setView] = useState('home');

  // UI feedback states
  const [badgeBump, setBadgeBump] = useState(false);
  const [toast, setToast] = useState(null); // { id, name }
  const toastTimerRef = useRef(null);
  const lastAddedRef = useRef(null);
  const badgeTimerRef = useRef(null);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const next = [...prev, product];
      lastAddedRef.current = product;
      return next;
    });

    // Trigger badge pulse using a separate ref timer (avoid mutating state object)
    setBadgeBump(true);
    if (badgeTimerRef.current) window.clearTimeout(badgeTimerRef.current);
    badgeTimerRef.current = window.setTimeout(() => setBadgeBump(false), 500);

    // Show toast
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast({ id: Date.now(), name: product?.name || 'Produkten' });
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2200);
  };

  const undoLastAdd = () => {
    const last = lastAddedRef.current;
    if (!last) return;
    setCartItems((prev) => {
      // remove one instance of last item from end
      const idxFromEnd = [...prev].reverse().findIndex((p) => p === last || p?.id === last?.id);
      if (idxFromEnd === -1) return prev;
      const removeIndex = prev.length - 1 - idxFromEnd;
      const copy = [...prev];
      copy.splice(removeIndex, 1);
      return copy;
    });
    setToast(null);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    const handler = () => setView('products');
    window.addEventListener('goToProducts', handler);
    return () => window.removeEventListener('goToProducts', handler);
  }, []);

  // Force background/text at runtime to bypass any external overrides
  useEffect(() => {
    try {
      document.documentElement.style.background = '#FFF6E6';
      document.body.style.background = '#FFF6E6';
      document.body.style.color = '#1E3A5F';
    } catch (_) {}
  }, []);

  const go = (v) => {
    setView(v);
  };

  return (
    <>
      <div className="page-bg" aria-hidden="true" />
      <div className={`app-container${view === 'home' ? ' is-home' : ''}`}>
        <header className="topbar">
          <div className="topbar-inner">
            <nav className="simple-nav" aria-label="Huvudmeny">
              <button className="nav-link" onClick={() => go('home')}>HEM</button>
              <button className="nav-link" onClick={() => go('products')}>PRODUKTER</button>
              <button className="nav-link cart-link" onClick={() => go('checkout')}>
                KASSA
                <span
                  className={`cart-badge${badgeBump ? ' bump' : ''}`}
                  aria-label={`Antal varor i kassan: ${cartItems.length}`}
                >
                  {cartItems.length}
                </span>
              </button>
              <button className="nav-link" onClick={() => go('about')}>OM OSS</button>
            </nav>
          </div>
        </header>

        {view === 'home' && (
          <main className="screen screen-center">
            <section className="home-hero-modern" aria-label="Nisses Bakery">
              <div className="home-hero-text" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                <h1 className="hero-title" style={{ margin: 0 }}>
                  Köp riktigt gott bröd online
                </h1>
                <p className="hero-lead" style={{ margin: '0.35rem 0 0 0' }}>
                  Färskt varje morgon. Snabb leverans. Enkelt att beställa.
                </p>
              </div>
              <img
                className="hero-logo"
                src="/nisse2.png"
                alt="Nisses Bakery"
                onError={(e) => {
                  const fallback = document.createElement('div');
                  fallback.className = 'hero-fallback';
                  fallback.textContent = 'nisses bakery';
                  const parent = e.target.parentElement;
                  if (parent) parent.replaceChild(fallback, e.target);
                }}
              />
            </section>
          </main>
        )}

        {view === 'main' && (
          <div className="screen">
            <div className="big-actions">
              <button className="action-tile" onClick={() => go('products')}>Produkter</button>
              <button className="action-tile" onClick={() => go('cart')}>Kundvagn ({cartItems.length})</button>
              <button className="action-tile" onClick={() => go('checkout')}>Kassa</button>
            </div>
          </div>
        )}

        {view === 'products' && (
          <div className="screen">
            <ProductList addToCart={addToCart} />
          </div>
        )}
        {view === 'cart' && (
          <div className="screen">
            <Cart
              items={cartItems}
              goToCheckout={() => setView('checkout')}
            />
          </div>
        )}
        {view === 'checkout' && (
          <div className="screen">
            <Checkout
              items={cartItems}
              onBack={undefined}
              onComplete={() => {
                clearCart();
                setView('main');
              }}
            />
          </div>
        )}

        {view === 'about' ? (
          <main
            className="screen screen-center"
            role="main"
            style={{
              backgroundColor: '#FFF6E6',
              minHeight: '100vh',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                pointerEvents: 'none',
                zIndex: 0
              }}
            >
              <img
                src="/nisse2.png"
                alt=""
                role="presentation"
                style={{
                  width: 'min(70vmin, 520px)',
                  height: 'auto',
                  opacity: 0.18,
                  filter: 'grayscale(100%) contrast(90%) brightness(105%)',
                  userSelect: 'none'
                }}
              />
            </div>

            <section aria-label="Om oss" style={{ textAlign: 'center', width: '100%', position: 'relative', zIndex: 1 }}>
              <p style={{
                margin: 0,
                fontSize: 'clamp(1.2rem, 3.8vw, 2rem)',
                lineHeight: 1.35,
                color: '#1E3A5F'
              }}>
                Jag är en kille på 10 år.
              </p>
            </section>
          </main>
        ) : null}

        {/* Toast */}
        {toast && (
          <div className="toast" role="status" aria-live="polite">
            <span>“{toast.name}” lades till i kassan.</span>
            <button className="toast-undo" onClick={undoLastAdd} aria-label="Ångra senaste tillägg">Ångra</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
