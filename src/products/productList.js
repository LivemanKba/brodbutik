import React, { useState, useRef } from 'react';
import products from '../data/products';

/**
 * Products page grid (sorteringsmeny borttagen per krav)
 */

function formatPrice(kr) {
  const n = Number(kr);
  if (!Number.isFinite(n)) return `${kr} kr`;
  return `${n.toLocaleString('sv-SE')} kr`;
}

const ProductList = ({ addToCart }) => {
  // Track which product id was just added for button feedback
  const [justAddedId, setJustAddedId] = useState(null);
  const timerRef = useRef(null);

  const handleBuy = (p) => {
    if (addToCart) addToCart(p);
    // success flash on this card's button
    window.clearTimeout(timerRef.current);
    setJustAddedId(p.id);
    timerRef.current = window.setTimeout(() => setJustAddedId(null), 900);
  };

  return (
    <section className="products-section" aria-labelledby="products-heading">
      <div className="products-header">
        <h1 id="products-heading" className="products-title">Produkter</h1>
        {/* Sorteringsmeny borttagen */}
      </div>

      <ul className="products-grid-modern" role="list" aria-label="Produktlista">
        {(products || []).map((p) => {
          const isJustAdded = justAddedId === p.id;
          return (
            <li key={p.id} className="product-card-modern" tabIndex="0" aria-label={`${p.name}, ${formatPrice(p.price)} inklusive moms`}>
              <div className="card-body">
                <h2 className="card-title-modern">{p.name}</h2>
                <p className="card-desc clamp-2" title={p.description}>
                  {p.description}
                </p>
              </div>
              <div className="card-footer-modern">
                <div className="price-wrap" aria-label={`Pris ${formatPrice(p.price)} inklusive moms`}>
                  <span className="price">{formatPrice(p.price)}</span>
                  <span className="vat">inkl. moms</span>
                </div>
                <button
                  className={`btn ${isJustAdded ? 'btn-success-flash' : 'btn-primary'}`}
                  onClick={() => handleBuy(p)}
                  aria-label={`Lägg ${p.name} i kundvagnen`}
                >
                  {isJustAdded ? 'Tillagd!' : 'Köp'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="products-actions">
        <button className="btn btn-outline" disabled aria-disabled="true">Ladda fler</button>
      </div>
    </section>
  );
};

export default ProductList;

