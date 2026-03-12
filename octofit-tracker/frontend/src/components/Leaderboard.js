import React, { useState, useEffect, useCallback } from 'react';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : '';

  const fetchLeaderboard = useCallback(() => {
    if (!codespaceName) {
      setError('REACT_APP_CODESPACE_NAME is not set.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    console.log('[Leaderboard] REST API endpoint:', apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[Leaderboard] fetched data:', data);
        const normalizedData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        setEntries(normalizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl, codespaceName]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

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
    return <div className="alert alert-danger">Error loading leaderboard: {error}</div>;
  }

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-badge rank-1';
    if (rank === 2) return 'rank-badge rank-2';
    if (rank === 3) return 'rank-badge rank-3';
    return 'rank-badge rank-other';
  };

  const filteredEntries = entries.filter((entry) => {
    const username = entry.user?.name || entry.user?.username || entry.username || '';
    const score = String(entry.score ?? '');
    const search = searchTerm.toLowerCase();
    return username.toLowerCase().includes(search) || score.toLowerCase().includes(search);
  });

  return (
    <div className="page-shell">
      <h2 className="page-title h2">🏆 Leaderboard</h2>

      <div className="card toolbar-card mb-3">
        <div className="card-body">
          <form className="row g-2 align-items-center" onSubmit={(e) => e.preventDefault()}>
            <div className="col-12 col-md-4">
              <input
                className="form-control"
                type="search"
                placeholder="Filter by user or score"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-light" type="button" onClick={() => setSearchTerm('')}>Clear</button>
            </div>
            <div className="col-auto">
              <button className="btn btn-light" type="button" onClick={fetchLeaderboard}>Refresh</button>
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
                  <th>Rank</th>
                  <th>User</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No leaderboard entries found.</td>
                  </tr>
                ) : (
                  filteredEntries.map((entry, index) => {
                    const rank = entry.rank || index + 1;
                    return (
                      <tr key={entry._id || entry.id || index}>
                        <td>{index + 1}</td>
                        <td>
                          <span className={getRankClass(rank)}>{rank}</span>
                        </td>
                        <td>{(entry.user?.name || entry.user?.username) || entry.username || '—'}</td>
                        <td>{entry.score !== undefined ? entry.score : '—'}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-light" type="button" onClick={() => setSelectedEntry(entry)}>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
                  <h3 className="modal-title h5 mb-0">Leaderboard Data Summary</h3>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Endpoint:</strong> {apiUrl || 'Not configured'}</p>
                  <p className="mb-0"><strong>Total rows:</strong> {entries.length}</p>
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

      {selectedEntry && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Leaderboard Entry Details</h3>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setSelectedEntry(null)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>User:</strong> {(selectedEntry.user?.name || selectedEntry.user?.username) || selectedEntry.username || '—'}</p>
                  <p className="mb-0"><strong>Score:</strong> {selectedEntry.score !== undefined ? selectedEntry.score : '—'}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedEntry(null)}>Close</button>
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

export default Leaderboard;
