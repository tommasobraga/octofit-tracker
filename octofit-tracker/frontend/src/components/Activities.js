import React, { useState, useEffect, useCallback } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : '';

  const fetchActivities = useCallback(() => {
    if (!codespaceName) {
      setError('REACT_APP_CODESPACE_NAME is not set.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    console.log('[Activities] REST API endpoint:', apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[Activities] fetched data:', data);
        const normalizedData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        setActivities(normalizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl, codespaceName]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const filteredActivities = activities.filter((activity) => {
    const user = activity.user?.name || activity.user?.username || activity.username || '';
    const type = activity.activity_type || activity.type || '';
    const search = searchTerm.toLowerCase();
    return user.toLowerCase().includes(search) || type.toLowerCase().includes(search);
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
    return <div className="alert alert-danger">Error loading activities: {error}</div>;
  }

  return (
    <div className="page-shell">
      <h2 className="page-title h2">🏃 Activities</h2>

      <div className="card toolbar-card mb-3">
        <div className="card-body">
          <form className="row g-2 align-items-center" onSubmit={(e) => e.preventDefault()}>
            <div className="col-12 col-md-4">
              <input
                className="form-control"
                type="search"
                placeholder="Filter by user or activity type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-light" type="button" onClick={() => setSearchTerm('')}>Clear</button>
            </div>
            <div className="col-auto">
              <button className="btn btn-light" type="button" onClick={fetchActivities}>Refresh</button>
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
                  <th>User</th>
                  <th>Activity Type</th>
                  <th>Duration</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No activities found.</td>
                  </tr>
                ) : (
                  filteredActivities.map((activity, index) => (
                    <tr key={activity._id || activity.id || index}>
                      <td>{index + 1}</td>
                      <td>{(activity.user?.name || activity.user?.username) || activity.username || '—'}</td>
                      <td>{activity.activity_type || activity.type || '—'}</td>
                      <td>{activity.duration ? `${activity.duration} min` : '—'}</td>
                      <td>{activity.date ? new Date(activity.date).toLocaleDateString() : '—'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-light" type="button" onClick={() => setSelectedActivity(activity)}>
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
                  <h3 className="modal-title h5 mb-0">Activities Data Summary</h3>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Endpoint:</strong> {apiUrl || 'Not configured'}</p>
                  <p className="mb-0"><strong>Total rows:</strong> {activities.length}</p>
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

      {selectedActivity && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Activity Details</h3>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setSelectedActivity(null)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>User:</strong> {(selectedActivity.user?.name || selectedActivity.user?.username) || selectedActivity.username || '—'}</p>
                  <p className="mb-2"><strong>Type:</strong> {selectedActivity.activity_type || selectedActivity.type || '—'}</p>
                  <p className="mb-2"><strong>Duration:</strong> {selectedActivity.duration ? `${selectedActivity.duration} min` : '—'}</p>
                  <p className="mb-0"><strong>Date:</strong> {selectedActivity.date ? new Date(selectedActivity.date).toLocaleDateString() : '—'}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedActivity(null)}>Close</button>
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

export default Activities;
