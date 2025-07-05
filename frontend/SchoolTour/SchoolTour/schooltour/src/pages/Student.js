import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import '../css/Login.css';

function Student() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', classLevel: '', gender: 'M' });
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('access_token');
  const parentId = localStorage.getItem('user_id'); // Ensure this is stored during login

  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch students associated with the logged-in parent
  const fetchStudents = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/students/?parent_id=${parentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for adding or editing a student
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, age, classLevel, gender } = formData;

    // Validate the form fields
    if (!name || !age || !classLevel || !gender) {
      setError('All fields are required.');
      return;
    }

    // Prepare the payload to send to the backend
    const payload = {
      name,
      age,
      classes: classLevel, // Backend expects 'classes' instead of 'classLevel'
      gender,
      parent_id: parentId,
    };

    // Set the URL for the request based on whether we're adding or editing a student
    const url = editId
      ? `http://127.0.0.1:8000/api/student/${editId}/`
      : 'http://127.0.0.1:8000/api/students/';

    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Swal.fire('Success', `Student ${editId ? 'updated' : 'added'} successfully`, 'success');
        fetchStudents(); // Fetch updated student list
        resetForm();
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  // Handle editing an existing student's data
  const handleEdit = (stu) => {
    setFormData({
      name: stu.name,
      age: stu.age,
      classLevel: stu.classes, // Match backend 'classes' field
      gender: stu.gender,
    });
    setEditId(stu.student_id);
    setShowForm(true);
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({ name: '', age: '', classLevel: '', gender: 'M' });
    setEditId(null);
    setShowForm(false);
    setError('');
  };

  return (
    <div className="dashboard-content" style={{ minHeight: '100vh' }}>
      <h2>Student Records</h2>
      <button onClick={() => setShowForm(true)} className="add-btn">+ Add Student</button>

      {/* Table to display existing students */}
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Class</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu) => (
            <tr key={stu.student_id}>
              <td>{stu.name}</td>
              <td>{stu.age}</td>
              <td>{stu.classes}</td>
              <td>{stu.gender === 'M' ? 'Male' : 'Female'}</td>
              <td><button onClick={() => handleEdit(stu)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal to add/edit student */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h4>{editId ? 'Update Student' : 'Add Student'}</h4>
            <form onSubmit={handleSubmit}>
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />

              <label>Age:</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required />

              <label>Class Level:</label>
              <input type="text" name="classLevel" value={formData.classLevel} onChange={handleChange} required />

              <label>Gender:</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>

              {error && <p className="error">{error}</p>}

              <button type="submit">{editId ? 'Update' : 'Register'}</button>
              <button type="button" onClick={resetForm}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Student;
