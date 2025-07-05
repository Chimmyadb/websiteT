import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';  // Axios instance with auth interceptors
import '../css/Login.css';

function StaffBooking() {
  const [bookings, setBookings] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({}); // Track selected status per booking
  const [loadingIds, setLoadingIds] = useState([]);       // Track loading state per booking
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/');
      setBookings(response.data);
      // Initialize statusUpdates with current booking statuses
      const initialStatus = {};
      response.data.forEach(b => {
        initialStatus[b.booking_id] = b.status;
      });
      setStatusUpdates(initialStatus);
      setError('');
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to fetch bookings');
    }
  };

  // Handle dropdown change (local state only)
  const handleStatusChange = (bookingId, newStatus) => {
    setStatusUpdates(prev => ({
      ...prev,
      [bookingId]: newStatus,
    }));
    setSuccessMessage('');
    setError('');
  };

  // Handle update button click - send PATCH request and refetch bookings
  const handleUpdateClick = async (bookingId) => {
    const newStatus = statusUpdates[bookingId];
    setLoadingIds(prev => [...prev, bookingId]);
    setError('');
    setSuccessMessage('');

    try {
      await api.patch(`/booking/${bookingId}/`, { status: newStatus });
      // Refetch bookings to sync with database
      await fetchBookings();
      setSuccessMessage(`Booking ${bookingId} status updated successfully.`);
    } catch (err) {
      setError('Failed to update booking status');
      console.error(err);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== bookingId));
    }
  };

  return (
    <div className="dashboard-content" style={{ padding: '20px', minHeight: '100vh' }}>
      <h2>Staff - View and Update Bookings</h2>

      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green', marginBottom: '15px' }}>{successMessage}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={thStyle}>Booking ID</th>
              <th style={thStyle}>Parent</th>
              <th style={thStyle}>Student</th>
              <th style={thStyle}>Tour</th>
              <th style={thStyle}>Booking Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => {
              const isLoading = loadingIds.includes(booking.booking_id);
              return (
                <tr key={booking.booking_id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tdStyle}>{booking.booking_id}</td>
                  <td style={tdStyle}>{booking.parent_name || 'N/A'}</td>
                  <td style={tdStyle}>{booking.student_name || 'N/A'}</td>
                  <td style={tdStyle}>{booking.tour_title || 'N/A'}</td>
                  <td style={tdStyle}>{new Date(booking.booking_date).toLocaleDateString()}</td>
                  <td style={{ ...tdStyle, textTransform: 'capitalize' }}>
                    {booking.status}
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={statusUpdates[booking.booking_id] || booking.status}
                      onChange={e => handleStatusChange(booking.booking_id, e.target.value)}
                      disabled={isLoading}
                      style={{ marginRight: '8px', padding: '5px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => handleUpdateClick(booking.booking_id)}
                      disabled={isLoading || statusUpdates[booking.booking_id] === booking.status}
                      style={{ padding: '5px 10px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                      {isLoading ? 'Updating...' : 'Update'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'left',
};

const tdStyle = {
  padding: '10px',
  border: '1px solid #ddd',
};

export default StaffBooking;
