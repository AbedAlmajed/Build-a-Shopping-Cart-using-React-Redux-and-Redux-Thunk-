


import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, fetchCart } from '../store/cartSlice';
import Swal from 'sweetalert2'; 

const Cart = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleRemoveFromCart = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFromCart(productId))
          .then(() => {
            dispatch(fetchCart()); 
            Swal.fire(
              'Removed!',
              'The item has been removed from your cart.',
              'success'
            );
          })
          .catch(() => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to remove item.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
      }
    });
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0).toFixed(2);
  };

  if (!user) {
    return <div className="text-center mt-8">Please log in to view your cart.</div>;
  }

  if (status === 'loading') {
    return <div className="text-center mt-8">Loading cart...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center">
                <img src={item.image || '/placeholder-image.jpg'} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                <div>
                  <h3 className="font-semibold">{item.name || 'Unknown Product'}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="font-bold">${((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.product_id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-8">
            <h3 className="text-xl font-bold">Total: ${calculateTotal()}</h3>
            <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
