import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/Footer'; // import the footer
import '../css/Login.css'; // Reuse the form styles

function Payment() {
  const [bookings, setBookings] = useState([
    { id: 1, tour: 'Safari Adventure', status: 'Pending', amountDue: 150 },
    { id: 2, tour: 'Historical Tour', status: 'Paid', amountDue: 0 },
  ]);

  const [payments, setPayments] = useState([
    {
      paymentId: 'P1001',
      bookingId: 2,
      amount: 200,
      method: 'Card',
      status: 'Paid',
      date: '2025-06-01',
    },
  ]);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [formData, setFormData] = useState({
    paymentId: '',
    amount: '',
    method: '',
    status: 'paid',
    date: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const openPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      paymentId: '',
      amount: booking.amountDue,
      method: '',
      status: 'pending',
      date: '',
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { paymentId, amount, method, status, date } = formData;

    if (!paymentId || !amount || !method || !status || !date) {
      setError('All fields are required.');
      setSuccess('');
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError('Amount must be a positive number.');
      setSuccess('');
      return;
    }

    const newPayment = {
      ...formData,
      bookingId: selectedBooking.id,
    };

    setPayments((prev) => [...prev, newPayment]);

    // Update booking status to 'Paid'
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id ? { ...b, status: 'Paid', amountDue: 0 } : b
      )
    );

    // Show SweetAlert success and then close modal
    await Swal.fire({
      icon: 'success',
      title: 'Payment Successful',
      text: `Payment for ${selectedBooking.tour} has been received.`,
      confirmButtonText: 'OK',
    });

    setSelectedBooking(null);
    setFormData({
      paymentId: '',
      amount: '',
      method: '',
      status: 'paid',
      date: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <h2>Your Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          <table className="student-table" style={{ backgroundColor: '#fff' }}>
            <thead>
              <tr>
                <th>Tour</th>
                <th>Status</th>
                <th>Amount Due</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.tour}</td>
                  <td>{booking.status}</td>
                  <td>${booking.amountDue}</td>
                  <td>
                    {booking.status.toLowerCase() !== 'paid' ? (
                      <button onClick={() => openPaymentModal(booking)}>
                        Make Payment
                      </button>
                    ) : (
                      'Paid'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 style={{ marginTop: '40px' }}>Your Payments</h2>
        {payments.length === 0 ? (
          <p>No payments made yet.</p>
        ) : (
          <table className="student-table" style={{ backgroundColor: '#fff' }}>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Booking</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => {
                const booking = bookings.find((b) => b.id === payment.bookingId);
                return (
                  <tr key={index}>
                    <td>{payment.paymentId}</td>
                    <td>{booking ? booking.tour : 'Unknown'}</td>
                    <td>${payment.amount}</td>
                    <td>{payment.method}</td>
                    <td>{payment.status}</td>
                    <td>{payment.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {selectedBooking && (
          <div
            className="modal"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              className="modal-content"
              style={{
                background: '#fff',
                padding: '20px',
                width: '400px',
                maxWidth: '90%',
                borderRadius: '8px',
              }}
            >
              <h4>Make Payment for {selectedBooking.tour}</h4>
              <form onSubmit={handleSubmit}>
                <label>Payment ID:</label>
                <input
                  type="text"
                  name="paymentId"
                  value={formData.paymentId}
                  onChange={handleChange}
                  required
                />

                <label>Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />

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

                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                 <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>

                <label>Payment Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <button type="submit" style={{ marginRight: '10px' }}>
                  Submit Payment
                </button>
                <button type="button" onClick={() => setSelectedBooking(null)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Payment;
