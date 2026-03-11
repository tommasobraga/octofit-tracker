import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
      : 'http://localhost:8000/api/leaderboard/';

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard data:', data);
        setEntries(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching leaderboard:', err);
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
    return <div className="alert alert-danger">Error loading leaderboard: {error}</div>;
  }

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-badge rank-1';
    if (rank === 2) return 'rank-badge rank-2';
    if (rank === 3) return 'rank-badge rank-3';
    return 'rank-badge rank-other';
  };

  return (
    <div>
      <h2 className="page-title">🏆 Leaderboard</h2>
      <div className="table-responsive">
        <table className="table octofit-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">No leaderboard entries found.</td>
              </tr>
            ) : (
              entries.map((entry, index) => {
                const rank = entry.rank || index + 1;
                return (
                  <tr key={entry._id || entry.id || index}>
                    <td>
                      <span className={getRankClass(rank)}>{rank}</span>
                    </td>
                    <td>{(entry.user?.name || entry.user?.username) || entry.username || '—'}</td>
                    <td>{entry.score !== undefined ? entry.score : '—'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
