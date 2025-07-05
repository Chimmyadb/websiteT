import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import '../css/Login.css';

function StaffTour() {
  const [tours, setTours] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    destination: '',
    amount: ''
  });
  const [editTour, setEditTour] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/tours/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setTours(data);
      } else {
        console.error('API did not return an array:', data);
        setTours([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setTours([]);
    }
  };

  const openModal = (tour = null) => {
    if (tour) {
      setFormData({
        title: tour.title,
        description: tour.description,
        date: tour.date,
        destination: tour.destination,
        amount: tour.amount || ''
      });
      setEditTour(tour);
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        destination: '',
        amount: ''
      });
      setEditTour(null);
    }
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, date, destination, amount } = formData;

    if (!title || !description || !date || !destination || amount === '') {
      setError('All fields are required.');
      return;
    }

    try {
      const payload = {
        ...formData,
        amount: parseInt(amount)
      };

      let res;
      if (editTour) {
        res = await fetch(`http://127.0.0.1:8000/api/tour/${editTour.tour_id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('http://127.0.0.1:8000/api/tours/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        Swal.fire('Success!', editTour ? 'Tour updated.' : 'Tour added.', 'success');
        fetchTours();
        setShowModal(false);
        setEditTour(null);
        setFormData({ title: '', description: '', date: '', destination: '', amount: '' });
        setError('');
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Server error.');
    }
  };

  const deleteTour = async (tour_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the tour.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/tour/${tour_id}/`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            Swal.fire('Deleted!', 'Tour has been removed.', 'info');
            fetchTours();
          } else {
            Swal.fire('Error', 'Failed to delete tour.', 'error');
          }
        } catch {
          Swal.fire('Error', 'Server error.', 'error');
        }
      }
    });
  };

  return (
    <div className="dashboard-content" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <h2>Staff - Manage Tours</h2>

      <button className="small-btn add" onClick={() => openModal()}>+ Add Tour</button>

      {Array.isArray(tours) && tours.length > 0 ? (
        <table className="student-table" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Destination</th>
              <th>Amount (TZS)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.tour_id}>
                <td>{tour.title}</td>
                <td>{tour.description}</td>
                <td>{tour.date}</td>
                <td>{tour.destination}</td>
                <td>{tour.amount}</td>
                <td>
                  <button className="small-btn edit" onClick={() => openModal(tour)}>Edit</button>
                  <button className="small-btn delete" onClick={() => deleteTour(tour.tour_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tours available.</p>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>{editTour ? 'Update Tour' : 'Add Tour'}</h4>
            <form onSubmit={handleSubmit}>
              <label>Title:</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} />

              <label>Description:</label>
              <textarea name="description" value={formData.description} onChange={handleChange}></textarea>

              <label>Date:</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} />

              <label>Destination:</label>
              <input type="text" name="destination" value={formData.destination} onChange={handleChange} />

              <label>Amount (TZS):</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} />

              {error && <p className="error">{error}</p>}

              <button type="submit">{editTour ? 'Update' : 'Save'}</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default StaffTour;
