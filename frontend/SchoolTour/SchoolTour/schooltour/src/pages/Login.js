import React, { useState } from 'react';
import '../css/Login.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    phone: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, username, password, phone, role } = formData;

    if (!username || !password || (!isLogin && (!firstName || !lastName || !phone || !role))) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setMessage('');

    try {
      if (isLogin) {
        // LOGIN
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          localStorage.setItem('role', data.role);
          localStorage.setItem('username', data.username);

          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: `Welcome, ${data.username || username}`,
            timer: 2000,
            showConfirmButton: false,
          });

          setTimeout(() => {
            const userRole = (data.role || '').toLowerCase();
            console.log('User role:', userRole);

            if (userRole === 'parent') {
              navigate('/pages/student');
            } else if (userRole === 'staff') {
              navigate('/staff/dashboard');
            } else if (!userRole) {
              setError('No role received from server. Please contact support.');
              console.log('Full login response:', data);
            } else {
              setError(`Unknown role received from server: "${data.role}". Please contact support.`);
              console.log('Full login response:', data);
            }
          }, 2000);
        } else {
          setError(data.detail || 'Login failed');
        }
      } else {
        // REGISTER
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            password,
            first_name: firstName,
            last_name: lastName,
            phone,
            role,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'You can now log in.',
            timer: 2000,
            showConfirmButton: false,
          });

          // Reset form
          setIsLogin(true);
          setFormData({
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            phone: '',
            role: '',
          });
        } else {
          setError(data.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Server error. Please try again later.');
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
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label>Last Name:</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div>
              <label>Phone:</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
              <label>Role:</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">-- Select Role --</option>
                <option value="parent">Parent</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </>
        )}
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
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
