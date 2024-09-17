import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const response = await axios.get('http://localhost:3000/api/cart');
    return response.data;
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productId) => {
    const response = await axios.post('http://localhost:3000/api/cart/add', { productId });
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId) => {
    await axios.delete(`http://localhost:3000/api/cart/${productId}`);
    return productId;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.map(item => ({
          ...item,
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 0
        }));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const newItem = {
          ...action.payload,
          price: parseFloat(action.payload.price) || 0,
          quantity: parseInt(action.payload.quantity) || 0
        };
        const existingItem = state.items.find(item => item.product_id === newItem.product_id);
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
    
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product_id !== action.payload);

      });
  },
});

export default cartSlice.reducer;