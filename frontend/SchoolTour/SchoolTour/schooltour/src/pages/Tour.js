import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import '../css/Login.css'; // or use a separate tour.css

const tours = [
  {
    tourId: 'T001',
    title: 'Zanzibar Exploration',
    description: 'A cultural and historical trip to Zanzibar.',
    date: '2025-07-10',
    destination: 'Zanzibar',
  },
  {
    tourId: 'T002',
    title: 'Mount Kilimanjaro Adventure',
    description: 'A hiking tour to explore Mount Kilimanjaro base.',
    date: '2025-08-15',
    destination: 'Kilimanjaro',
  },
  {
    tourId: 'T003',
    title: 'Bagamoyo Coastal Retreat',
    description: 'Relaxing getaway to Bagamoyo’s beautiful beaches.',
    date: '2025-09-05',
    destination: 'Bagamoyo',
  },
];



function Tour() {
  const [selectedTour, setSelectedTour] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    parentName: '',
    studentName: '',
  });
  const [bookings, setBookings] = useState([]);

  const openModal = (tour) => {
    setSelectedTour(tour);
    setBookingInfo({ parentName: '', studentName: '' });
    setModalVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { parentName, studentName } = bookingInfo;

    if (!parentName || !studentName) {
      Swal.fire('Error', 'Please fill out all fields.', 'error');
      return;
    }

    const newBooking = {
      tourId: selectedTour.tourId,
      tourTitle: selectedTour.title,
      tourDate: selectedTour.date,
      destination: selectedTour.destination,
      studentName,
      parentName,
      status: 'Pending',
    };

    setBookings([...bookings, newBooking]);
    setModalVisible(false);
    Swal.fire(
      'Booked!',
      `${parentName}, your child ${studentName} has booked the "${selectedTour.title}" tour.`,
      'success'
    );
  };

  return (
    <div
      className="tour-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '60px', // space for footer
      }}
    >
      <h2>Available Tours</h2>
      <div className="tour-grid" style={{ flex: 1 }}>
        {tours.map((tour) => (
          <div key={tour.tourId} className="tour-card">
            <h3>{tour.title}</h3>
            <p>
              <strong>Description:</strong> {tour.description}
            </p>
            <p>
              <strong>Date:</strong> {tour.date}
            </p>
            <p>
              <strong>Destination:</strong> {tour.destination}
            </p>
            <button onClick={() => openModal(tour)}>Book Now</button>
          </div>
        ))}
      </div>

      {/* Booking Status Section */}
      {bookings.length > 0 && (
        <div className="booking-status" style={{ marginTop: '20px' }}>
          <h3>Your Bookings</h3>
          <table className="student-table">
            <thead>
              <tr>
                <th>Tour Title</th>
                <th>Student Name</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr key={idx}>
                  <td>{b.tourTitle}</td>
                  <td>{b.studentName}</td>
                  <td>{b.destination}</td>
                  <td>{b.tourDate}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h4>Book Tour: {selectedTour.title}</h4>
            <form onSubmit={handleSubmit}>
              <label>Parent Name:</label>
              <input
                type="text"
                name="parentName"
                value={bookingInfo.parentName}
                onChange={handleChange}
                required
              />
              <label>Student Name:</label>
              <input
                type="text"
                name="studentName"
                value={bookingInfo.studentName}
                onChange={handleChange}
                required
              />
              <div style={{ marginTop: '10px' }}>
                <button type="submit">Confirm Booking</button>
                <button
                  type="button"
                  style={{ marginLeft: '10px' }}
                  onClick={() => setModalVisible(false)}
                >
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

export default Tour;
