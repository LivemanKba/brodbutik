import React from 'react';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Pris: {product.price} kr</p>
      <button onClick={() => addToCart(product)}>Lägg i varukorg</button>
    </div>
  );
};

export default ProductCard;

