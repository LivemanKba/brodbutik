import React, { useState } from 'react';
import './checkout.css'; // <-- Lägg till denna rad
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
        <div className="checkout-form">
          <h2 className="checkout-section-title">Kontaktuppgifter</h2>
          <form onSubmit={handleSubmit} id="checkout-form">
            <input name="name" placeholder="Namn" value={form.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="E-post" value={form.email} onChange={handleChange} required />
            <h3>Leveransadress</h3>
            <input name="address" placeholder="Gatuadress" value={form.address} onChange={handleChange} required />
            <input name="zip" placeholder="Postnummer" value={form.zip} onChange={handleChange} required />
            <input name="city" placeholder="Stad" value={form.city} onChange={handleChange} required />
          </form>
        </div>

        <div className="checkout-summary">
          <h2 className="checkout-section-title">Din beställning</h2>
          <div className="checkout-items">
            {items.map((item, i) => (
              <div key={i} className="checkout-item">
                <span>{item.name}</span>
                <span>{item.price} kr</span>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <div className="checkout-total-line" />
            <div className="checkout-total-values">
              <strong>Totalt:</strong>
              <strong>{total} kr</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-submit">
        <button type="button" onClick={onBack}>Tillbaka</button>
        <button type="submit" form="checkout-form">Skicka beställning</button>
      </div>
    </div>
  );
};

export default Checkout;
