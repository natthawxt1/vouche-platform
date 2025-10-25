import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Show success message or redirect
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/shop" className="text-gray-600 hover:text-primary-600">Shop</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg p-8">
          {/* Product Image */}
          <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-12 flex items-center justify-center">
            <div className="text-9xl">🎮</div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.8)</span>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">${product.price}</div>
              <p className="text-gray-600">Digital delivery - Instant access</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600">{product.description || 'No description available'}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-800">Category:</span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {product.category_name}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-800">Stock:</span>
                <span className={`font-semibold ${product.stock > 20 ? 'text-green-600' : 'text-orange-600'}`}>
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-800 mb-2">Quantity:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-16 text-center text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full btn-primary text-lg py-4"
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button className="w-full btn-secondary text-lg py-4">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <div className="text-sm font-medium">Secure Payment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-sm font-medium">Instant Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm font-medium">Guaranteed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Details</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">How to redeem:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Purchase the gift card</li>
                <li>Receive your digital code via email</li>
                <li>Visit the official redemption website</li>
                <li>Enter your code and enjoy!</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Important Notes:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Digital delivery only</li>
                <li>No refunds after purchase</li>
                <li>Valid for 12 months</li>
                <li>Can be used multiple times until balance is zero</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;