
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../store/productSlice';
import Swal from 'sweetalert2'; 

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addProduct(newProduct)).unwrap();
      Swal.fire({
        title: 'Success!',
        text: 'Product added successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      setNewProduct({ name: '', description: '', price: '', image: '' });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add product.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProduct(editingProduct)).unwrap();
      Swal.fire({
        title: 'Success!',
        text: 'Product updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      setEditingProduct(null);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update product.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(productId))
          .unwrap()
          .then(() => {
            Swal.fire(
              'Deleted!',
              'Product has been deleted.',
              'success'
            );
          })
          .catch(() => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete product.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
      }
    });
  };

  if (status === 'loading') {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      
      {/* Add New Product Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Add New Product</h3>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Product Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Product
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Product List</h3>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              {editingProduct && editingProduct.id === product.id ? (
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Save Changes
                  </button>
                  <button onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2">
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h4 className="text-lg font-semibold">{product.name}</h4>
                  <p>{product.description}</p>
                  <p className="font-bold">${product.price}</p>
                  <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mt-2" />
                  <div className="mt-2">
                    <button onClick={() => setEditingProduct(product)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
