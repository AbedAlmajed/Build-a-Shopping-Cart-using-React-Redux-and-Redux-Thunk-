
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-extrabold tracking-wide hover:text-blue-200 transition-all">
          ShopCart
        </Link>

        <div className="flex items-center space-x-6">
          <Link 
            to="/products" 
            className="text-white text-lg font-medium hover:text-blue-200 transition-colors duration-300"
          >
            Products
          </Link>

          {user && (
            <Link 
              to="/cart" 
              className="relative text-white text-lg font-medium hover:text-blue-200 transition-colors duration-300"
            >
              Cart
              <span className="ml-1 inline-block bg-red-500 text-white rounded-full text-xs px-2 py-1">
                {cartItemCount}
              </span>
            </Link>
          )}

          {user ? (
            <div className="relative group">
              <button className="text-white text-lg font-medium flex items-center focus:outline-none group-hover:text-blue-200">
                {user.username}
                <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg py-2 w-48 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-white text-lg font-medium hover:text-blue-200 transition-colors duration-300"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-white text-lg font-medium hover:text-blue-200 transition-colors duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;