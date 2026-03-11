import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
      : 'http://localhost:8000/api/activities/';

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Activities data:', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">Error loading activities: {error}</div>;
  }

  return (
    <div>
      <h2 className="page-title">🏃 Activities</h2>
      <div className="table-responsive">
        <table className="table octofit-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Activity Type</th>
              <th>Duration</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No activities found.</td>
              </tr>
            ) : (
              activities.map((activity, index) => (
                <tr key={activity._id || activity.id || index}>
                  <td>{(activity.user?.name || activity.user?.username) || activity.username || '—'}</td>
                  <td>{activity.activity_type || activity.type || '—'}</td>
                  <td>{activity.duration ? `${activity.duration} min` : '—'}</td>
                  <td>{activity.date ? new Date(activity.date).toLocaleDateString() : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activities;
