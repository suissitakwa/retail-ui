import React, { useEffect, useState } from 'react';
import { fetchProducts, addToCart } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Shop() {
  const { user } = useAuth();
   const { refreshCartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' });
 useEffect(() => {
    fetchProducts()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
        setNotification({ message: 'Could not load products.', type: 'error' });
      });
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user || !user.id) {
      setNotification({ message: 'Please log in to add items to your cart.', type: 'error' });
      return;
    }

    setAdding(prev => ({ ...prev, [productId]: true }));
    setNotification({ message: '', type: '' }); // Clear any previous notification

    try {
      await addToCart(productId, 1);


      refreshCartCount();

      setNotification({ message: 'Product added to cart!', type: 'success' });
    } catch (err) {
      console.error('Add to cart failed:', err);
      setNotification({ message: 'Failed to add to cart. Check console for details.', type: 'error' });
    } finally {
      setAdding(prev => ({ ...prev, [productId]: false }));
    }
  };

  const closeNotification = () => setNotification({ message: '', type: '' });

  if (loading) return <div className="text-center my-5 p-5 text-xl font-medium">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-6 text-gray-800 border-b pb-2">Shop</h2>

      <NotificationBar
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300" key={p.id}>
            <img
              src={p.imageUrl || 'https://placehold.co/150x150/EEEEEE/333333?text=Product'}
              className="w-full h-48 object-cover rounded-t-xl"
              alt={p.name}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/EEEEEE/333333?text=Product' }}
            />
            <div className="p-5 flex flex-col h-full">
              <h5 className="text-xl font-semibold mb-2 text-gray-900">{p.name}</h5>
              <p className="text-2xl font-bold text-indigo-600 mb-4">${p.price.toFixed(2)}</p>
              <button
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors mt-auto
                  ${adding[p.id] || !user ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                onClick={() => handleAddToCart(p.id)}
                disabled={adding[p.id] || !user}
              >
                {!user ? 'Login Required' : adding[p.id] ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
