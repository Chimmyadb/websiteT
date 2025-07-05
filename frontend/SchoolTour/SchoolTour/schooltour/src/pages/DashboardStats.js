import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance'; // your Axios instance with auth

function DashboardStats() {
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalStudents: 0,
    totalTours: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard-stats/')
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load dashboard stats'));
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Dashboard Overview</h2>

      <div style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        marginTop: '20px',
        marginBottom: '40px',
      }}>
        <div style={{
          flex: '1',
          minWidth: '200px',
          backgroundColor: '#E3F2FD',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <h3>Total Students</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0D47A1' }}>
            {stats.totalStudents}
          </p>
        </div>

        <div style={{
          flex: '1',
          minWidth: '200px',
          backgroundColor: '#E8F5E9',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <h3>Total Tours</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1B5E20' }}>
            {stats.totalTours}
          </p>
        </div>

        <div style={{
          flex: '1',
          minWidth: '200px',
          backgroundColor: '#FFF3E0',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <h3>Total Payments</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF6C00' }}>
            {stats.totalPayments}
          </p>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default DashboardStats;
