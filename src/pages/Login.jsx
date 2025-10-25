import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ถ้า login แล้วให้ redirect ไปหน้าแรก
  if (user) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับ Demo - Login โดยไม่ต้องเรียก Backend
  const handleDemoLogin = (role) => {
    const demoUser = {
      user_id: role === 'admin' ? 1 : 2,
      name: role === 'admin' ? 'Admin User' : 'Demo User',
      email: role === 'admin' ? 'admin@vouche.com' : 'user@vouche.com',
      role: role
    };
    
    localStorage.setItem('token', 'demo_token_' + role);
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
    window.location.reload(); // Reload to update auth state
  };

  const handleGoogleLogin = () => {
    alert('Google login will be implemented by backend team');
  };

  const handleTrustLogin = () => {
    alert('Trust login will be implemented by backend team');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">VOUCHÉ</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Sign In To VOUCHÉ</h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Demo Login Buttons */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 mb-3 font-medium">🎮 Demo Mode (No Backend Needed)</p>
            <div className="space-y-2">
              <button
                onClick={() => handleDemoLogin('user')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Login as User
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Login as Admin
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or login with credentials</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-600 transition-colors"
            >
              <span className="text-xl">🔍</span>
              <span className="font-medium">Sign in with Google</span>
            </button>
            
            <button
              onClick={handleTrustLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-600 transition-colors"
            >
              <span className="text-xl">🔐</span>
              <span className="font-medium">Sign in with Trust</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">— O R —</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 block">
              Forgot Password?
            </Link>
            
            <div className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign Up
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <Link to="/terms" className="hover:text-gray-700">Terms & Conditions</Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-1">Demo Credentials (for backend testing):</p>
            <p>User: user@vouche.com / admin123</p>
            <p>Admin: admin@vouche.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;