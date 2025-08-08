import React from 'react';

const Cart = ({ items, goToCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart">
      <h2>Kundvagn</h2>
      {items.length === 0 ? (
        <p>Din kundvagn är tom.</p>
      ) : (
        <>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name} – {item.price} kr
              </li>
            ))}
          </ul>
          <p><strong>Totalt:</strong> {total} kr</p>
          <button className="primary" onClick={goToCheckout}>Till kassan</button>
        </>
      )}
    </div>
  );
};

export default Cart;

