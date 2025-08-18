
import React from 'react';
import './home.css';
import productsData from './data/products';

function Home() {
  const featured = (productsData || []).slice(0, 6);

  return (
    <main>
      {/* Subtle hero with faint watermark logo */}
      <section className="home-hero-modern">
        <div className="home-hero-inner">
          <h1 className="hero-title">Köp riktigt gott bröd online</h1>
          <p className="hero-lead">Färskt varje morgon. Snabb leverans. Enkelt att beställa.</p>
          <div className="hero-cta">
            <button
              className="btn btn-primary"
              onClick={() => window.dispatchEvent(new CustomEvent('goToProducts'))}
            >
              Utforska produkter
            </button>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="featured-section">
        <div className="featured-header">
          <h2>Utvalda produkter</h2>
        </div>
        <div className="featured-grid">
          {featured.map((p) => (
            <article className="featured-card" key={p.id} tabIndex="0" aria-label={p.name}>
              <div className="featured-card-body">
                <h3 className="featured-title">{p.name}</h3>
                <p className="featured-desc">{p.description}</p>
              </div>
              <div className="featured-card-footer">
                <span className="featured-price">{p.price} kr</span>
                <button
                  className="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('goToProducts'))}
                  aria-label={`Visa ${p.name}`}
                >
                  Visa
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;

