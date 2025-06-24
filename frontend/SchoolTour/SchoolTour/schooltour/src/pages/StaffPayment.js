import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import '../css/Login.css';
import StaffSidebar from '../components/StaffSidebar';

function StaffPayment() {
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    amount: '',
    date: '',
    status: 'Pending',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');

  const openModal = (index = null) => {
    if (index !== null) {
      setFormData(payments[index]);
      setEditIndex(index);
    } else {
      setFormData({
        parentName: '',
        studentName: '',
        amount: '',
        date: '',
        status: 'Pending',
      });
      setEditIndex(null);
    }
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { parentName, studentName, amount, date, status } = formData;

    if (!parentName || !studentName || !amount || !date || !status) {
      setError('All fields are required.');
      return;
    }

    const updated = [...payments];
    if (editIndex !== null) {
      updated[editIndex] = formData;
      Swal.fire('Updated!', 'Payment updated.', 'success');
    } else {
      updated.push(formData);
      Swal.fire('Added!', 'Payment recorded.', 'success');
    }

    setPayments(updated);
    setShowModal(false);
    setFormData({ parentName: '', studentName: '', amount: '', date: '', status: 'Pending' });
    setEditIndex(null);
    setError('');
  };

  const deletePayment = (index) => {
    const updated = [...payments];
    updated.splice(index, 1);
    setPayments(updated);
    Swal.fire('Deleted!', 'Payment removed.', 'info');
  };

  return (
    <div className="dashboard-content" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <h2>Staff - Manage Payments</h2>

      <button className="small-btn add" onClick={() => openModal()}>
        + Add Payment
      </button>

      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <table className="student-table" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Parent</th>
              <th>Student</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.parentName}</td>
                <td>{payment.studentName}</td>
                <td>{payment.amount}</td>
                <td>{payment.date}</td>
                <td>{payment.status}</td>
                <td>
                  <button className="small-btn edit" onClick={() => openModal(index)}>Edit</button>
                  <button className="small-btn delete" onClick={() => deletePayment(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>{editIndex !== null ? 'Update Payment' : 'Add Payment'}</h4>
            <form onSubmit={handleSubmit}>
              <label>Parent Name:</label>
              <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} />
              <label>Student Name:</label>
              <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} />
              <label>Amount:</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
              <label>Date:</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} />
              <label>Status:</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
              {error && <p className="error">{error}</p>}
              <button type="submit">{editIndex !== null ? 'Update' : 'Save'}</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default StaffPayment;
