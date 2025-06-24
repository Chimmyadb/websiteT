import React, { useState } from 'react';
import Swal from 'sweetalert2';

import '../css/Login.css';
// import '../css/sidebar.css';
import Footer from '../components/Footer'; // import Footer

function Student() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '', classLevel: '' });
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, age, classLevel } = formData;

    if (!name || !age || !classLevel) {
      setError('All fields are required.');
      return;
    } else if (!/^\d+$/.test(age) || parseInt(age) < 3 || parseInt(age) > 20) {
      setError('Age must be a number between 3 and 20.');
      return;
    }

    if (editIndex !== null) {
      const updatedStudents = [...students];
      updatedStudents[editIndex] = formData;
      setStudents(updatedStudents);
      Swal.fire('Updated!', 'Student updated successfully.', 'success');
    } else {
      setStudents([...students, formData]);
      Swal.fire('Success!', 'Student registered successfully.', 'success');
    }

    setFormData({ name: '', age: '', classLevel: '' });
    setEditIndex(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (index) => {
    setFormData(students[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  return (
    <div
      className="dashboard-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <div className="dashboard-content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <h2>Student Records</h2>

        <button
          className="add-btn"
          onClick={() => {
            setFormData({ name: '', age: '', classLevel: '' });
            setEditIndex(null);
            setShowForm(true);
          }}
        >
          + Add Student
        </button>

        {students.length === 0 ? (
          <p>No students added yet.</p>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Class Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu, index) => (
                <tr key={index}>
                  <td>{stu.name}</td>
                  <td>{stu.age}</td>
                  <td>{stu.classLevel}</td>
                  <td>
                    <button onClick={() => handleEdit(index)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h4>{editIndex !== null ? 'Update Student' : 'Add Student'}</h4>
              <form onSubmit={handleSubmit}>
                <label>Student Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
                <label>Class Level:</label>
                <input
                  type="text"
                  name="classLevel"
                  value={formData.classLevel}
                  onChange={handleChange}
                  required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">{editIndex !== null ? 'Update' : 'Register'}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', age: '', classLevel: '' });
                    setEditIndex(null);
                    setError('');
                  }}
                >
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

export default Student;
