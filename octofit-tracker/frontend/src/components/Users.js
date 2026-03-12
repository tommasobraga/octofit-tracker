import React, { useState, useEffect, useCallback } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : '';

  const fetchUsers = useCallback(() => {
    if (!codespaceName) {
      setError('REACT_APP_CODESPACE_NAME is not set.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    console.log('[Users] REST API endpoint:', apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[Users] fetched data:', data);
        const normalizedData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        setUsers(normalizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl, codespaceName]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const name = user.username || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
    const email = user.email || '';
    const search = searchTerm.toLowerCase();
    return name.toLowerCase().includes(search) || email.toLowerCase().includes(search);
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
    return <div className="alert alert-danger">Error loading users: {error}</div>;
  }

  return (
    <div className="page-shell">
      <h2 className="page-title h2">👤 Users</h2>

      <div className="card toolbar-card mb-3">
        <div className="card-body">
          <form className="row g-2 align-items-center" onSubmit={(e) => e.preventDefault()}>
            <div className="col-12 col-md-4">
              <input
                className="form-control"
                type="search"
                placeholder="Filter by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-light" type="button" onClick={() => setSearchTerm('')}>Clear</button>
            </div>
            <div className="col-auto">
              <button className="btn btn-light" type="button" onClick={fetchUsers}>Refresh</button>
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
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user._id || user.id || index}>
                      <td>{index + 1}</td>
                      <td>{user.username || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '—'}</td>
                      <td>{user.email || '—'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-light" type="button" onClick={() => setSelectedUser(user)}>
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
                  <h3 className="modal-title h5 mb-0">Users Data Summary</h3>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Endpoint:</strong> {apiUrl || 'Not configured'}</p>
                  <p className="mb-0"><strong>Total rows:</strong> {users.length}</p>
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

      {selectedUser && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">User Details</h3>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setSelectedUser(null)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Name:</strong> {selectedUser.username || selectedUser.name || `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() || '—'}</p>
                  <p className="mb-0"><strong>Email:</strong> {selectedUser.email || '—'}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
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

export default Users;
