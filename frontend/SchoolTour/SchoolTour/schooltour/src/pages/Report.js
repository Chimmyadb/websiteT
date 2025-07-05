import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Login.css';

function Report() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/reports/');
      setReports(response.data);
      setFilteredReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const handleFilterChange = (e) => {
    const keyword = e.target.value.toLowerCase();
    setFilter(keyword);
    if (keyword.trim() === '') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(
        reports.filter((report) =>
          report.tour_id.title.toLowerCase().includes(keyword)
        )
      );
    }
  };

  return (
    <div className="report-container">
      <h2>Tour Reports</h2>
      <input
        type="text"
        placeholder="Filter by tour title..."
        value={filter}
        onChange={handleFilterChange}
        className="report-filter"
      />

      <div className="report-list">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div className="report-card" key={report.report_id}>
              <h3>{report.title}</h3>
              <p className="report-tour">
                <strong>Tour:</strong> {report.tour_id.title}
              </p>
              <p>{report.content}</p>
              <p className="report-date">
                <strong>Created At:</strong> {new Date(report.created_at).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No reports found.</p>
        )}
      </div>
    </div>
  );
}

export default Report;
