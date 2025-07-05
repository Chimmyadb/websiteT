import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import '../css/Login.css';

function Tour() {
  const [tours, setTours] = useState([]);
  const [students, setStudents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', bookingDate: '' });
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  const token = localStorage.getItem('access_token');

  // Fetch tours
  const fetchTours = useCallback(async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/tours/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTours(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      setTours([]);
    }
  }, [token]);

  // Fetch students filtered for logged-in parent
  const fetchStudents = useCallback(async () => {
    try {
      // Assuming backend filters students by parent automatically based on token
      const res = await fetch('http://127.0.0.1:8000/api/students/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setStudents([]);
    }
  }, [token]);

  // Fetch bookings for the parent user
  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/bookings/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    }
  }, [token]);

  useEffect(() => {
    fetchTours();
    fetchStudents();
    fetchBookings();
  }, [fetchTours, fetchStudents, fetchBookings]);

  const openModalForBooking = (booking) => {
    const tourObj = tours.find((t) => t.tour_id === booking.tour);
    setSelectedTour(tourObj || null);
    setFormData({
      studentId: booking.student,
      bookingDate: booking.booking_date,
    });
    setEditingBookingId(booking.booking_id);
    setModalVisible(true);
  };

  // Handle checkbox toggle for bookings
  const toggleBookingSelection = (bookingId) => {
    setSelectedBookings((prevSelected) => {
      if (prevSelected.includes(bookingId)) {
        return prevSelected.filter((id) => id !== bookingId);
      } else {
        return [...prevSelected, bookingId];
      }
    });
  };

  // Handle "Update Selected" button click
  const handleUpdateSelected = () => {
    if (selectedBookings.length === 0) {
      Swal.fire('Info', 'Please select a booking to update.', 'info');
      return;
    }
    if (selectedBookings.length > 1) {
      Swal.fire('Info', 'Please select only one booking to update at a time.', 'info');
      return;
    }
    const bookingToEdit = bookings.find((b) => b.booking_id === selectedBookings[0]);
    if (bookingToEdit) {
      openModalForBooking(bookingToEdit);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { studentId, bookingDate } = formData;

    if (!studentId || !selectedTour) {
      Swal.fire('Error', 'Student and Tour are required.', 'error');
      return;
    }
    if (!bookingDate && !editingBookingId) {
      Swal.fire('Error', 'Booking date is required.', 'error');
      return;
    }

    try {
      if (editingBookingId) {
        const res = await fetch(`http://127.0.0.1:8000/api/bookings/${editingBookingId}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            student: Number(studentId),
            // You can add other fields to update here if needed
          }),
        });

        if (res.ok) {
          Swal.fire('Success!', 'Booking updated.', 'success');
          setModalVisible(false);
          setSelectedBookings([]); // Clear selection after update
          fetchBookings();
        } else {
          const data = await res.json();
          Swal.fire('Error', data.message || 'Update failed.', 'error');
        }
      } else {
        const res = await fetch('http://127.0.0.1:8000/api/bookings/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            student: Number(studentId),
            tour: selectedTour.tour_id,
            booking_date: bookingDate,
          }),
        });

        if (res.ok) {
          Swal.fire('Success!', 'Booking confirmed.', 'success');
          setModalVisible(false);
          fetchBookings();
        } else {
          const data = await res.json();
          Swal.fire('Error', data.message || 'Booking failed.', 'error');
        }
      }
    } catch (error) {
      Swal.fire('Error', 'Server error.', 'error');
    }
  };

  const todayDate = new Date().toISOString().split('T')[0];

  // Styles for booking table
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  };

  const thStyle = {
    borderBottom: '2px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
  };

  const tdStyle = {
    borderBottom: '1px solid #ddd',
    padding: '8px',
  };

  return (
    <div className="dashboard-content" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <h2>Parent - Tour Booking</h2>

      {/* Tour Cards */}
      <div className="tour-grid">
        {tours.map((tour) => (
          <div key={tour.tour_id} className="tour-card">
            <h3>{tour.title}</h3>
            <p><strong>Description:</strong> {tour.description}</p>
            <p><strong>Date:</strong> {tour.date}</p>
            <p><strong>Destination:</strong> {tour.destination}</p>
            <p><strong>Amount:</strong> {tour.amount} TZS</p>
            <button onClick={() => {
              setSelectedTour(tour);
              setFormData({ studentId: '', bookingDate: '' });
              setEditingBookingId(null);
              setModalVisible(true);
            }}>Book Now</button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {modalVisible && selectedTour && (
        <div className="modal">
          <div className="modal-content">
            <h4>{editingBookingId ? 'Update Booking' : `Book Tour: ${selectedTour.title}`}</h4>
            <form onSubmit={handleSubmit}>
              <label>Select Student:</label>
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Student --</option>
                {students.map((s) => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <label>Booking Date:</label>
              <input
                type="date"
                name="bookingDate"
                min={todayDate}
                value={formData.bookingDate}
                onChange={handleChange}
                required={!editingBookingId}
                disabled={!!editingBookingId}
              />

              <label>Tour Amount (TZS):</label>
              <input
                type="text"
                value={`${selectedTour.amount} TZS`}
                disabled
              />

              <div style={{ marginTop: '10px' }}>
                <button type="submit">{editingBookingId ? 'Update Booking' : 'Confirm Booking'}</button>
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  style={{ marginLeft: '10px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking List with checkboxes and Update Selected button */}
      <div className="booking-section" style={{ marginTop: '30px' }}>
        <h3>Your Bookings</h3>
        {(!Array.isArray(bookings) || bookings.length === 0) ? (
          <p>No bookings found.</p>
        ) : (
          <>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {/* <th style={thStyle}>Select</th> */}
                  <th style={thStyle}>Tour</th>
                  <th style={thStyle}>Student</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.booking_id}>
                    {/* <td style={tdStyle}>
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.booking_id)}
                        onChange={() => toggleBookingSelection(booking.booking_id)}
                      />
                    </td> */}
                    <td style={tdStyle}>{booking.tour_title}</td>
                    <td style={tdStyle}>{booking.student_name}</td>
                    <td style={tdStyle}>{booking.booking_date}</td>
                    <td style={tdStyle}>{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <button
              style={{ marginTop: '15px' }}
              onClick={handleUpdateSelected}
              disabled={selectedBookings.length === 0}
            >
              Update Selected
            </button> */}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Tour;
