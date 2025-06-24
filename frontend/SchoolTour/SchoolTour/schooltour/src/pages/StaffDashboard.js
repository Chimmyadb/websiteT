import React, { useState } from 'react';
import '../css/Login.css'; // Reuse the form styles

function StaffDashboard() {
  const [formData, setFormData] = useState({
    paymentId: '',
    amount: '',
    method: '',
    status: '',
    date: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { paymentId, amount, method, status, date } = formData;

    if (!paymentId || !amount || !method || !status || !date) {
      setError('All fields are required.');
      setSuccess('');
    } else if (isNaN(amount) || Number(amount) <= 0) {
      setError('Amount must be a positive number.');
      setSuccess('');
    } else {
      setError('');
      setSuccess('Payment information submitted successfully.');
      console.log('Payment Form Submitted:', formData);
      // Reset form
      setFormData({
        paymentId: '',
        amount: '',
        method: '',
        status: '',
        date: '',
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Payment Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Payment ID:</label>
          <input
            type="text"
            name="paymentId"
            value={formData.paymentId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Method:</label>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Method --</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank">Bank Transfer</option>
            <option value="mobile">Mobile Money</option>
          </select>
        </div>

        <div>
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Status --</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div>
          <label>Payment Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default StaffDashboard;
