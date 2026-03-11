import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
      : 'http://localhost:8000/api/teams/';

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Teams data:', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching teams:', err);
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
    return <div className="alert alert-danger">Error loading teams: {error}</div>;
  }

  const formatMembers = (team) => {
    if (Array.isArray(team.members)) {
      return team.members.map(m => m.name || m.username || String(m)).join(', ') || '—';
    }
    return team.members || '—';
  };

  return (
    <div>
      <h2 className="page-title">👥 Teams</h2>
      <div className="table-responsive">
        <table className="table octofit-table">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center">No teams found.</td>
              </tr>
            ) : (
              teams.map((team, index) => (
                <tr key={team._id || team.id || index}>
                  <td>{team.name || '—'}</td>
                  <td>{formatMembers(team)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Teams;
