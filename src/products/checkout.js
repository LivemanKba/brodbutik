import React, { useState } from 'react';
import ThankYou from './thankyou';

const Checkout = ({ items, onBack, onComplete }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    zip: '',
    city: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  if (submitted) return <ThankYou />;

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Kassa</h2>
      <div className="checkout-content">
        <form className="checkout-form" id="checkout-form" onSubmit={handleSubmit}>
          <h3>Kontaktuppgifter</h3>
          <input name="name" placeholder="Namn" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="E-post" value={form.email} onChange={handleChange} required />

          <h3>Leveransadress</h3>
          <input name="address" placeholder="Gatuadress" value={form.address} onChange={handleChange} required />
          <input name="zip" placeholder="Postnummer" value={form.zip} onChange={handleChange} required />
          <input name="city" placeholder="Stad" value={form.city} onChange={handleChange} required />
        </form>

        <div className="checkout-summary">
          <h3>Din beställning</h3>
          <div className="checkout-items">
            {items.map((item, i) => (
              <div key={i} className="checkout-item">
                <span>{item.name}</span>
                <span>{item.price} kr</span>
              </div>
            ))}
          </div>

          <div className="checkout-total">
            <hr />
            <strong>Totalt:</strong>
            <strong>{total} kr</strong>
          </div>
        </div>
      </div>

      <div className="checkout-submit">
        <button type="submit" form="checkout-form">Skicka beställning</button>
      </div>
    </div>
  );
};

export default Checkout;
