// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto mt-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to ShopCart</h1>
      <p className="text-xl mb-8">Discover amazing products at great prices!</p>
      <Link to="/products" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition duration-300">
        Start Shopping
      </Link>
    </div>
  );
};

export default Home;