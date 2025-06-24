import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import '../css/Login.css';
import StaffSidebar from '../components/StaffSidebar';

function StaffTour() {
  const [tours, setTours] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');

  const openModal = (index = null) => {
    if (index !== null) {
      setFormData(tours[index]);
      setEditIndex(index);
    } else {
      setFormData({ title: '', description: '', date: '', location: '' });
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
    const { title, description, date, location } = formData;
    if (!title || !description || !date || !location) {
      setError('All fields are required.');
      return;
    }

    const updated = [...tours];
    if (editIndex !== null) {
      updated[editIndex] = formData;
      Swal.fire('Updated!', 'Tour updated successfully.', 'success');
    } else {
      updated.push(formData);
      Swal.fire('Added!', 'New tour added.', 'success');
    }

    setTours(updated);
    setFormData({ title: '', description: '', date: '', location: '' });
    setShowModal(false);
    setEditIndex(null);
    setError('');
  };

  const deleteTour = (index) => {
    const updated = [...tours];
    updated.splice(index, 1);
    setTours(updated);
    Swal.fire('Deleted!', 'Tour has been removed.', 'info');
  };

  return (
    <div className="dashboard-content" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <h2>Staff - Manage Tours</h2>

      <button className="small-btn add" onClick={() => openModal()}>+ Add Tour</button>

      {tours.length === 0 ? (
        <p>No tours available.</p>
      ) : (
        <table className="student-table" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour, index) => (
              <tr key={index}>
                <td>{tour.title}</td>
                <td>{tour.description}</td>
                <td>{tour.date}</td>
                <td>{tour.location}</td>
                <td>
                  <button className="small-btn edit" onClick={() => openModal(index)}>Edit</button>
                  <button className="small-btn delete" onClick={() => deleteTour(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>{editIndex !== null ? 'Update Tour' : 'Add Tour'}</h4>
            <form onSubmit={handleSubmit}>
              <label>Title:</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} />
              <label>Description:</label>
              <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
              <label>Date:</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} />
              <label>Location:</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} />
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

export default StaffTour;
