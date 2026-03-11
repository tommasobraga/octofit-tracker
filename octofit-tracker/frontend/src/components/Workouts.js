import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
      : 'http://localhost:8000/api/workouts/';

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Workouts data:', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching workouts:', err);
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
    return <div className="alert alert-danger">Error loading workouts: {error}</div>;
  }

  return (
    <div>
      <h2 className="page-title">💪 Workouts</h2>
      <div className="table-responsive">
        <table className="table octofit-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {workouts.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">No workouts found.</td>
              </tr>
            ) : (
              workouts.map((workout, index) => (
                <tr key={workout._id || workout.id || index}>
                  <td>{workout.name || '—'}</td>
                  <td>{workout.description || '—'}</td>
                  <td>{workout.duration ? `${workout.duration} min` : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Workouts;
