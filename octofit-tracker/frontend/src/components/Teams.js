import React, { useState, useEffect, useCallback } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : '';

  const fetchTeams = useCallback(() => {
    if (!codespaceName) {
      setError('REACT_APP_CODESPACE_NAME is not set.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    console.log('[Teams] REST API endpoint:', apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[Teams] fetched data:', data);
        const normalizedData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        setTeams(normalizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching teams:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl, codespaceName]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

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
    return <div className="alert alert-danger">Error loading teams: {error}</div>;
  }

  const formatMembers = (team) => {
    if (Array.isArray(team.members)) {
      return team.members.map(m => m.name || m.username || String(m)).join(', ') || '—';
    }
    return team.members || '—';
  };

  const filteredTeams = teams.filter((team) => {
    const members = formatMembers(team);
    const search = searchTerm.toLowerCase();
    return (team.name || '').toLowerCase().includes(search) || members.toLowerCase().includes(search);
  });

  return (
    <div className="page-shell">
      <h2 className="page-title h2">👥 Teams</h2>

      <div className="card toolbar-card mb-3">
        <div className="card-body">
          <form className="row g-2 align-items-center" onSubmit={(e) => e.preventDefault()}>
            <div className="col-12 col-md-4">
              <input
                className="form-control"
                type="search"
                placeholder="Filter by team or member"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-light" type="button" onClick={() => setSearchTerm('')}>Clear</button>
            </div>
            <div className="col-auto">
              <button className="btn btn-light" type="button" onClick={fetchTeams}>Refresh</button>
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
                  <th>Team Name</th>
                  <th>Members</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No teams found.</td>
                  </tr>
                ) : (
                  filteredTeams.map((team, index) => (
                    <tr key={team._id || team.id || index}>
                      <td>{index + 1}</td>
                      <td>{team.name || '—'}</td>
                      <td>{formatMembers(team)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-light" type="button" onClick={() => setSelectedTeam(team)}>
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
                  <h3 className="modal-title h5 mb-0">Teams Data Summary</h3>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Endpoint:</strong> {apiUrl || 'Not configured'}</p>
                  <p className="mb-0"><strong>Total rows:</strong> {teams.length}</p>
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

      {selectedTeam && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Team Details</h3>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setSelectedTeam(null)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Team:</strong> {selectedTeam.name || '—'}</p>
                  <p className="mb-0"><strong>Members:</strong> {formatMembers(selectedTeam)}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedTeam(null)}>Close</button>
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

export default Teams;
