import React, { useState } from 'react';
import '../css/Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = formData;
    if (!email || !password || (!isLogin && (!firstName || !lastName))) {
      setError('All fields are required.');
    } else if (password.length < 6) {
      setError('Password must be at least 6 characters.');
    } else {
      setError('');
      // Handle form submission logic here
      console.log(isLogin ? 'Logging in' : 'Registering', formData);
    }
  };

  return (
    <div className="form-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
          {isLogin ? 'Create one' : 'Login here'}
        </span>
      </p>
    </div>
  );
}

export default Login;
