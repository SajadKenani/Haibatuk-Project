import { useState } from 'react';

export const LOGIN = () => {
  // State for form inputs and feedback
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError('');

    // Simulate authentication using environment variables
    const storedUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const storedPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    try {
      if (username === storedUsername && password === storedPassword) {
        // Simulate token generation and store it

        alert('Login successful!');
        localStorage.setItem("login", "true")
        window.location.href = '/admin'; // Redirect to admin page
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <form
        onSubmit={handleLogin}
        className="bg-gray-700 p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl text-white font-bold mb-6">Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-100 font-medium mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-100 font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LOGIN;
