import React, { useState } from 'react';

const Checkout = ({ items, onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    postalCode: '',
    city: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // I ett riktigt projekt: validering + skicka data till backend/databas
    onComplete();
  };

  return (
    <div className="checkout">
      <h2>Slutför din beställning</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Namn</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>E-post</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Gatuadress</label>
          <input type="text" name="street" value={formData.street} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Postnummer</label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Stad</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit">Skicka beställning</button>
        <button type="button" onClick={onBack} style={{ marginLeft: '10px', backgroundColor: '#ccc', color: '#000' }}>
          Tillbaka
        </button>
      </form>
    </div>
  );
};

export default Checkout;
