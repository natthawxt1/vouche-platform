import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import valoImg from '../../assets/valo_giftcard.png';
import netflixImg from '../../assets/img_netflix.png';
import defaultImg from "../../assets/defaultImg.jpg";
//import steamImg from './assets/steam_giftcard.jpg';

const ProductCard = ({ product }) => {

  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const getProductImage = (product) => {
    if (!product?.name) return defaultImg;

    const name = product.name.toLowerCase();

    if (name.includes('valo')) return valoImg;
    if (name.includes('netflix')) return netflixImg;
    if (name.includes('spotify')) return spotifyImg;

    return product.image || defaultImg;
  };

  return (
    <Link to={`/product/${product.product_id}`}>
      <div className="card group">
        <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 p-6 flex items-center justify-center relative overflow-hidden">
          {/* Product Image Placeholder */}
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          
          {/* Stock Badge */}
          {product.stock > 0 && product.stock < 20 && (
            <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Low Stock
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-primary-600">
              ${product.price}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.stock}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full btn-primary text-sm"
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;