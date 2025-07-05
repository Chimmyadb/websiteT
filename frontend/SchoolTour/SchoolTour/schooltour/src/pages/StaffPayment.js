import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import '../css/Login.css';
import api from '../api/axiosInstance';  // Axios instance with auth interceptors

function StaffPayment() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  // Fetch payments on component mount
  useEffect(() => {
    api.get('/payments/')
      .then(response => setPayments(response.data))
      .catch(() => setError('Failed to fetch payments'));
  }, []);

  // Handle payment status update
  const handleStatusChange = (index, newStatus) => {
    const updatedPayments = [...payments];
    const paymentToUpdate = updatedPayments[index];
    const oldStatus = paymentToUpdate.status;
    paymentToUpdate.status = newStatus;

    api.patch(`/payment/${paymentToUpdate.payment_id}/`, { status: newStatus })
      .then(() => {
        setPayments(updatedPayments);
        Swal.fire('Success', 'Payment status updated', 'success');
      })
      .catch(() => {
        // Revert status on failure
        paymentToUpdate.status = oldStatus;
        setPayments(updatedPayments);
        setError('Failed to update payment status');
      });
  };

  return (
    <div className="dashboard-content" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <h2>Staff - View Payments</h2>

      {error && <p className="error" style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <table className="student-table" style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Parent</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Student</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Amount</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => {
              const formattedDate = payment.payment_date
                ? new Date(payment.payment_date).toLocaleDateString()
                : 'N/A';

              return (
                <tr key={payment.payment_id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {payment.parentName || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {payment.studentName || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{payment.amount}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formattedDate}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textTransform: 'capitalize' }}>
                    {payment.status}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <select
                      value={payment.status}
                      onChange={e => handleStatusChange(index, e.target.value)}
                      style={{ padding: '5px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <Footer />
    </div>
  );
}

export default StaffPayment;
