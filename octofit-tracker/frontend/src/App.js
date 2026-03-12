import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container-fluid home-hero py-4">
      <div className="card feature-card mb-4">
        <div className="card-body p-4 p-lg-5 text-center">
          <img src="/octofitapp-small.png" alt="OctoFit Logo" style={{ width: '100px', marginBottom: '1.5rem', borderRadius: '50%' }} />
          <h1 className="display-6 fw-bold mb-3">Welcome to OctoFit Tracker</h1>
          <p className="lead mb-4">Your all-in-one fitness companion for tracking activities, competing with teams, and crushing your goals.</p>

          <form className="row g-2 justify-content-center mb-3" onSubmit={(e) => e.preventDefault()}>
            <div className="col-12 col-md-6">
              <input className="form-control" type="text" placeholder="Search app features..." aria-label="Search app features" />
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-light" type="submit">Search</button>
            </div>
          </form>

          <div className="d-flex flex-wrap justify-content-center gap-2">
            <NavLink className="btn btn-light" to="/users">Explore Data</NavLink>
            <button className="btn btn-outline-light" type="button" onClick={() => setShowModal(true)}>About OctoFit</button>
            <a className="btn btn-link link-light text-decoration-none" href="https://getbootstrap.com/docs/5.3/getting-started/introduction/" target="_blank" rel="noreferrer">Bootstrap Docs</a>
          </div>
        </div>
      </div>

      <div className="row g-3 justify-content-center mt-1">
        {[
          { icon: '👤', title: 'User Profiles', desc: 'Manage your fitness profile and personal goals.' },
          { icon: '🏃', title: 'Activity Logging', desc: 'Log runs, swims, cycling, and more.' },
          { icon: '👥', title: 'Team Management', desc: 'Create teams and challenge your friends.' },
          { icon: '🏆', title: 'Leaderboard', desc: 'See who is leading the fitness race.' },
          { icon: '💪', title: 'Workouts', desc: 'Discover personalized workout suggestions.' },
        ].map((f) => (
          <div key={f.title} className="col-12 col-md-6 col-lg-4">
            <div className="card feature-card h-100">
              <div className="card-body">
                <h2 className="h5 card-title">{f.icon} {f.title}</h2>
                <p className="card-text mb-0">{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title h5 mb-0">About OctoFit Tracker</h2>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2">Track users, teams, activities, leaderboard rankings, and workouts from the Django REST API.</p>
                  <p className="mb-0">Use the navigation menu to explore each dataset with consistent Bootstrap tables and controls.</p>
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
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-octofit">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <img src="/octofitapp-small.png" alt="OctoFit Logo" />
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {[
                { to: '/', label: 'Home' },
                { to: '/users', label: 'Users' },
                { to: '/teams', label: 'Teams' },
                { to: '/activities', label: 'Activities' },
                { to: '/leaderboard', label: 'Leaderboard' },
                { to: '/workouts', label: 'Workouts' },
              ].map((link) => (
                <li key={link.to} className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    to={link.to}
                    end={link.to === '/'}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="app-banner" aria-label="OctoFit app branding">
        <img className="app-banner-logo" src="/octofitapp-small.png" alt="OctoFit logo" />
        <div className="app-banner-copy">
          <p className="app-banner-title">Train smarter with OctoFit</p>
          <p className="app-banner-subtitle">Track every rep, run, and ranking in one place.</p>
        </div>
      </div>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
