import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || '0000';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-sm text-gray-600 mb-2">Order Number</div>
            <div className="text-2xl font-bold text-primary-600 mb-4">
              #{orderId.toString().padStart(4, '0')}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-center gap-2 text-gray-700 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Check your email for gift codes</span>
              </div>
              <p className="text-xs text-gray-500">
                We've sent your digital codes to your email address
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link to="/orders" className="block w-full btn-primary">
              View Order History
            </Link>
            <Link to="/shop" className="block w-full btn-secondary">
              Continue Shopping
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="text-left">
                <div className="font-semibold text-blue-900 text-sm mb-1">Quick Tip</div>
                <p className="text-xs text-blue-800">
                  Save your gift codes in a secure place. You can always access them from your order history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;