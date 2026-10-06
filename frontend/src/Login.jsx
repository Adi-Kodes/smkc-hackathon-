import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from './config';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanUser = username.trim();
      const cleanPass = password.trim();

      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data = {};

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error(
          `Backend returned ${response.status} (${response.statusText || 'HTML'}). Target URL: ${API_BASE_URL}/api/login. Please verify your backend is active.`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || `Login failed (${response.status})`);
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'supervisor') {
        navigate('/dashboard');
      } else {
        navigate('/mobile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eff7f0]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#e2ede3]">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#e8f4e9] p-4 rounded-full mb-4">
            <ShieldCheck size={40} className="text-[#2e6b36]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1d4422]">Sign In to FieldSetu</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your credentials to access your portal</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2e6b36] focus:border-[#2e6b36] outline-none transition-all"
                placeholder="Enter your username (e.g. supervisor1)"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2e6b36] focus:border-[#2e6b36] outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2e6b36] hover:bg-[#24552b] text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 text-center mb-3">Quick Demo Auto-Fill:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setUsername('supervisor1'); setPassword('password123'); }}
              className="py-2 px-3 text-xs bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 hover:bg-emerald-100 font-medium transition-colors cursor-pointer"
            >
              👤 Supervisor
            </button>
            <button
              type="button"
              onClick={() => { setUsername('worker1'); setPassword('password123'); }}
              className="py-2 px-3 text-xs bg-blue-50 text-blue-800 rounded-lg border border-blue-200 hover:bg-blue-100 font-medium transition-colors cursor-pointer"
            >
              👷 Worker
            </button>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-3">
            Password: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">password123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
