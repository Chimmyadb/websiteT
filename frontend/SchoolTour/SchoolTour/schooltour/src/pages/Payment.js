import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import '../css/Login.css';
import api from '../api/axiosInstance'; // Your configured Axios instance

function Payment() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [formData, setFormData] = useState({
    amount: '',
    method: '',
    status: 'pending',
    date: '',
    student: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchPayments();
    fetchStudents();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/');
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings.');
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/');
      setPayments(response.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments.');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students/');
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students.');
    }
  };

  // Helper to get student ID from booking object
  const getStudentIdFromBooking = (booking) => {
    if (booking && booking.student) {
      return typeof booking.student === 'object' ? booking.student.id : booking.student;
    }
    return '';
  };

  const openModal = (index = null, booking = null) => {
    setError('');
    if (index !== null) {
      const selectedPayment = payments[index];
      setFormData({
        amount: selectedPayment.amount || '',
        method: selectedPayment.methods || '',
        status: selectedPayment.status || 'pending',
        date: selectedPayment.payment_date || '',
        student: selectedPayment.student || '',
      });
      setEditIndex(index);
      setSelectedBooking(null);
    } else if (booking) {
      const studentId = getStudentIdFromBooking(booking);
      if (!studentId) {
        setError('Cannot add payment: Student ID not found for this booking.');
        return;
      }
      setSelectedBooking(booking);
      setFormData({
        amount: '',
        method: '',
        status: 'pending',
        date: '',
        student: studentId,
      });
      setEditIndex(null);
    } else {
      setFormData({
        amount: '',
        method: '',
        status: 'pending',
        date: '',
        student: '',
      });
      setEditIndex(null);
      setSelectedBooking(null);
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { amount, method, status, date, student } = formData;

    const trimmedAmount = amount.toString().trim();
    const trimmedMethod = method.trim();
    const trimmedStatus = status.trim();
    const trimmedDate = date.trim();
    const studentId = parseInt(student);

    if (
      !trimmedAmount ||
      !trimmedMethod ||
      !trimmedStatus ||
      !trimmedDate ||
      isNaN(studentId) ||
      !studentId
    ) {
      setError('Please ensure all fields are filled correctly.');
      return;
    }

    const payload = {
      amount: parseInt(trimmedAmount),
      methods: trimmedMethod,
      status: trimmedStatus,
      payment_date: trimmedDate,
      student: studentId,
    };

    const url =
      editIndex !== null
        ? `/payments/${payments[editIndex].payment_id}/`
        : '/payments/';
    const methodType = editIndex !== null ? 'put' : 'post';

    try {
      const response = await api({
        method: methodType,
        url,
        data: payload,
      });

      if (response.status >= 200 && response.status < 300) {
        Swal.fire(
          'Success',
          `Payment ${editIndex !== null ? 'updated' : 'added'} successfully`,
          'success'
        );
        fetchPayments();
        setShowModal(false);
        setFormData({ amount: '', method: '', status: 'pending', date: '', student: '' });
        setEditIndex(null);
        setSelectedBooking(null);
      } else {
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Server error';
      Swal.fire('Error', message, 'error');
    }
  };

  // Helper to get student name for display
  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'N/A';
  };

  return (
    <div className="dashboard-content" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <h2>Payments</h2>

      <h3>Bookings</h3>
      <table className="student-table" style={{ marginBottom: '30px' }}>
        <thead>
          <tr>
            <th>Booking Details</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.booking_id}>
              <td>
                {b.parent_name || 'N/A'} (Parent) - {b.student_name || 'N/A'} (Student) -{' '}
                {b.tour_title || 'N/A'} (Tour) - {new Date(b.booking_date).toLocaleDateString()}
              </td>
              <td>{b.status?.toUpperCase()}</td>
              <td>
                {b.status?.toLowerCase() !== 'paid' && (
                  <button onClick={() => openModal(null, b)} className="small-btn add">
                    Add Payment
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Payment Records</h3>
      <table className="student-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
            <th>Student</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.payment_id}>
              <td>{p.payment_id}</td>
              <td>{p.amount}</td>
              <td>{p.methods}</td>
              <td>{p.status}</td>
              <td>{p.payment_date}</td>
              <td>{getStudentName(p.student)}</td>
              <td>
                <button className="small-btn edit" onClick={() => openModal(payments.indexOf(p))}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>{editIndex !== null ? 'Edit Payment' : 'Add Payment'}</h4>
            <form onSubmit={handleSubmit}>
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />

              <label>Method:</label>
              <select name="method" value={formData.method} onChange={handleChange} required>
                <option value="">-- Select Method --</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank">Bank</option>
                <option value="mobile">Mobile</option>
              </select>

              <label>Status:</label>
              <input type="text" name="status" value={formData.status} disabled />

              <label>Date:</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />

              <label>Student:</label>
              {selectedBooking ? (
                <input
                  type="text"
                  value={getStudentName(formData.student)}
                  disabled
                  readOnly
                  style={{ backgroundColor: '#f0f0f0' }}
                />
              ) : (
                <select name="student" value={formData.student} onChange={handleChange} required>
                  <option value="">-- Select Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name}
                    </option>
                  ))}
                </select>
              )}

              {error && <p className="error">{error}</p>}

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button type="submit">{editIndex !== null ? 'Update' : 'Save'} Payment</button>
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Payment;
