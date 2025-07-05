import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import '../css/Login.css';
// import StaffSidebar from '../components/StaffSidebar';

function StaffUsers() {
  const [parents, setParents] = useState([]);
  const [selectedParentIndex, setSelectedParentIndex] = useState(null);
  const [showParentModal, setShowParentModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [parentForm, setParentForm] = useState({ name: '', phone: '', email: '' });
  const [studentForm, setStudentForm] = useState({ name: '', age: '', classLevel: '' });
  const [error, setError] = useState('');
  const [editStudentIndex, setEditStudentIndex] = useState(null);

  const openParentModal = (index = null) => {
    if (index !== null) {
      setParentForm(parents[index]);
      setSelectedParentIndex(index);
    } else {
      setParentForm({ name: '', phone: '', email: '', students: [] });
      setSelectedParentIndex(null);
    }
    setError('');
    setShowParentModal(true);
  };

  const openStudentModal = (parentIndex, studentIndex = null) => {
    setSelectedParentIndex(parentIndex);
    if (studentIndex !== null) {
      setStudentForm(parents[parentIndex].students[studentIndex]);
      setEditStudentIndex(studentIndex);
    } else {
      setStudentForm({ name: '', age: '', classLevel: '' });
      setEditStudentIndex(null);
    }
    setShowStudentModal(true);
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleParentSubmit = (e) => {
    e.preventDefault();
    const { name, phone, email } = parentForm;
    if (!name || !phone || !email) {
      setError('All fields are required.');
      return;
    }
    if (!/^\d{10,15}$/.test(phone)) {
      setError('Phone must be 10–15 digits.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
      return;
    }

    if (selectedParentIndex !== null) {
      const updated = [...parents];
      updated[selectedParentIndex] = { ...parentForm };
      setParents(updated);
      Swal.fire('Updated!', 'Parent info updated.', 'success');
    } else {
      setParents([...parents, { ...parentForm, students: [] }]);
      Swal.fire('Added!', 'Parent info saved.', 'success');
    }

    setShowParentModal(false);
    setParentForm({ name: '', phone: '', email: '' });
    setError('');
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    const { name, age, classLevel } = studentForm;

    if (!name || !age || !classLevel) {
      setError('All student fields are required.');
      return;
    }

    const updatedParents = [...parents];
    const parent = updatedParents[selectedParentIndex];

    if (!parent.students) parent.students = [];

    if (editStudentIndex !== null) {
      parent.students[editStudentIndex] = studentForm;
    } else {
      parent.students.push(studentForm);
    }

    setParents(updatedParents);
    setShowStudentModal(false);
    setStudentForm({ name: '', age: '', classLevel: '' });
    setEditStudentIndex(null);
    setError('');
    Swal.fire('Success!', 'Student info saved.', 'success');
  };

  const deleteParent = (index) => {
    const updated = [...parents];
    updated.splice(index, 1);
    setParents(updated);
    Swal.fire('Deleted!', 'Parent removed.', 'info');
  };

  const deleteStudent = (pIndex, sIndex) => {
    const updated = [...parents];
    updated[pIndex].students.splice(sIndex, 1);
    setParents(updated);
    Swal.fire('Deleted!', 'Student removed.', 'info');
  };

  return (
    <div className="dashboard-content" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <h2>Staff - Manage Parents & Students</h2>

      <button className="small-btn add" onClick={() => openParentModal()}>
        + Add Parent
      </button>

      {parents.length === 0 ? (
        <p>No parent records yet.</p>
      ) : (
        parents.map((parent, index) => (
          <div key={index} style={{ border: '1px solid #ccc', marginTop: '20px', padding: '15px' }}>
            <h3>{parent.name}</h3>
            <p><strong>Phone:</strong> {parent.phone}</p>
            <p><strong>Email:</strong> {parent.email}</p>

            <div>
              <button className="small-btn edit" onClick={() => openParentModal(index)}>Edit</button>
              <button className="small-btn delete" onClick={() => deleteParent(index)}>Delete</button>
              <button className="small-btn add" onClick={() => openStudentModal(index)}>+ Student</button>
            </div>

            {parent.students && parent.students.length > 0 && (
              <table className="student-table" style={{ marginTop: '15px' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Class Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parent.students.map((student, sIndex) => (
                    <tr key={sIndex}>
                      <td>{student.name}</td>
                      <td>{student.age}</td>
                      <td>{student.classLevel}</td>
                      <td>
                        <button className="small-btn edit" onClick={() => openStudentModal(index, sIndex)}>
                          Edit
                        </button>
                        <button className="small-btn delete" onClick={() => deleteStudent(index, sIndex)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}

      {/* Parent Modal */}
      {showParentModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>{selectedParentIndex !== null ? 'Update Parent' : 'Add Parent'}</h4>
            <form onSubmit={handleParentSubmit}>
              <label>Parent Name:</label>
              <input type="text" name="name" value={parentForm.name} onChange={handleParentChange} />
              <label>Phone:</label>
              <input type="text" name="phone" value={parentForm.phone} onChange={handleParentChange} />
              <label>Email:</label>
              <input type="email" name="email" value={parentForm.email} onChange={handleParentChange} />
              {error && <p className="error">{error}</p>}
              <button type="submit">{selectedParentIndex !== null ? 'Update' : 'Save'}</button>
              <button type="button" onClick={() => setShowParentModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {showStudentModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>{editStudentIndex !== null ? 'Update Student' : 'Add Student'}</h4>
            <form onSubmit={handleStudentSubmit}>
              <label>Student Name:</label>
              <input type="text" name="name" value={studentForm.name} onChange={handleStudentChange} />
              <label>Age:</label>
              <input type="number" name="age" value={studentForm.age} onChange={handleStudentChange} />
              <label>Class Level:</label>
              <input type="text" name="classLevel" value={studentForm.classLevel} onChange={handleStudentChange} />
              {error && <p className="error">{error}</p>}
              <button type="submit">{editStudentIndex !== null ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => setShowStudentModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default StaffUsers;
