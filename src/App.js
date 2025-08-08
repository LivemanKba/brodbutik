import React, { useState } from 'react';
import './styles/app.css';

import ProductList from './products/productList';
import Cart from './products/cart';
import Checkout from './products/checkout';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [view, setView] = useState('products'); // 'products', 'cart', 'checkout'

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Nisses Brödbutik</h1>
        <nav>
          <button onClick={() => setView('products')}>Produkter</button>
          <button onClick={() => setView('cart')}>Kundvagn ({cartItems.length})</button>
        </nav>
      </header>

      {view === 'products' && <ProductList addToCart={addToCart} />}
      {view === 'cart' && (
        <Cart
          items={cartItems}
          goToCheckout={() => setView('checkout')}
        />
      )}
      {view === 'checkout' && (
        <Checkout
          items={cartItems}
          onBack={() => setView('cart')}
          onComplete={() => {
            clearCart();
            setView('products');
          }}
        />
      )}
    </div>
  );
}

export default App;
