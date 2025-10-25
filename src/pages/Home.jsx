import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/products/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsRes.data.slice(0, 6));
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              ULTIMATE SALE
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Get amazing deals on gaming gift cards, subscriptions, and digital content
            </p>
            <Link to="/shop" className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Browse by Category</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.category_id}
                to={`/shop?category=${category.category_id}`}
                className="p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-center"
              >
                <div className="text-3xl mb-2">🎮</div>
                <div className="font-medium">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <Link to="/shop" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Countdown Timer */}
      <section className="py-12 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">DEALS OF THE MONTH</h2>
          <p className="mb-6">Hurry, Sales End In Two Late!</p>
          <div className="flex justify-center gap-4 text-center">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-lg">
              <div className="text-3xl font-bold">02</div>
              <div className="text-sm">Days</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-lg">
              <div className="text-3xl font-bold">05</div>
              <div className="text-sm">Hrs</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-lg">
              <div className="text-3xl font-bold">30</div>
              <div className="text-sm">Min</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-lg">
              <div className="text-3xl font-bold">00</div>
              <div className="text-sm">Sec</div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['ROBLOX', 'XBOX', 'VALORANT', 'STEAM'].map((brand) => (
              <div key={brand} className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;