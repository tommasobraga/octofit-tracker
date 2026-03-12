import React, { useState, useEffect, useCallback } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : '';

  const fetchWorkouts = useCallback(() => {
    if (!codespaceName) {
      setError('REACT_APP_CODESPACE_NAME is not set.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    console.log('[Workouts] REST API endpoint:', apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[Workouts] fetched data:', data);
        const normalizedData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        setWorkouts(normalizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl, codespaceName]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const filteredWorkouts = workouts.filter((workout) => {
    const name = workout.name || '';
    const description = workout.description || '';
    const search = searchTerm.toLowerCase();
    return name.toLowerCase().includes(search) || description.toLowerCase().includes(search);
  });

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
    <div className="page-shell">
      <h2 className="page-title h2">💪 Workouts</h2>

      <div className="card toolbar-card mb-3">
        <div className="card-body">
          <form className="row g-2 align-items-center" onSubmit={(e) => e.preventDefault()}>
            <div className="col-12 col-md-4">
              <input
                className="form-control"
                type="search"
                placeholder="Filter by name or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-light" type="button" onClick={() => setSearchTerm('')}>Clear</button>
            </div>
            <div className="col-auto">
              <button className="btn btn-light" type="button" onClick={fetchWorkouts}>Refresh</button>
            </div>
            <div className="col-auto">
              <button className="btn btn-secondary" type="button" onClick={() => setShowModal(true)}>Info</button>
            </div>
            <div className="col-12 col-md-auto ms-md-auto">
              <a className="btn btn-link link-light text-decoration-none ps-0" href={apiUrl || '#'} target="_blank" rel="noreferrer">Open API Endpoint</a>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle octofit-table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No workouts found.</td>
                  </tr>
                ) : (
                  filteredWorkouts.map((workout, index) => (
                    <tr key={workout._id || workout.id || index}>
                      <td>{index + 1}</td>
                      <td>{workout.name || '—'}</td>
                      <td>{workout.description || '—'}</td>
                      <td>{workout.duration ? `${workout.duration} min` : '—'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-light" type="button" onClick={() => setSelectedWorkout(workout)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Workouts Data Summary</h3>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Endpoint:</strong> {apiUrl || 'Not configured'}</p>
                  <p className="mb-0"><strong>Total rows:</strong> {workouts.length}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {selectedWorkout && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Workout Details</h3>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setSelectedWorkout(null)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Name:</strong> {selectedWorkout.name || '—'}</p>
                  <p className="mb-2"><strong>Description:</strong> {selectedWorkout.description || '—'}</p>
                  <p className="mb-0"><strong>Duration:</strong> {selectedWorkout.duration ? `${selectedWorkout.duration} min` : '—'}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedWorkout(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default Workouts;
