import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="home-hero">
      <img src="/octofitapp-small.png" alt="OctoFit Logo" style={{ width: '100px', marginBottom: '1.5rem', borderRadius: '50%' }} />
      <h1>Welcome to OctoFit Tracker</h1>
      <p>Your all-in-one fitness companion for tracking activities, competing with teams, and crushing your goals.</p>
      <div className="row justify-content-center mt-4">
        {[
          { icon: '👤', title: 'User Profiles', desc: 'Manage your fitness profile and personal goals.' },
          { icon: '🏃', title: 'Activity Logging', desc: 'Log runs, swims, cycling, and more.' },
          { icon: '👥', title: 'Team Management', desc: 'Create teams and challenge your friends.' },
          { icon: '🏆', title: 'Leaderboard', desc: 'See who is leading the fitness race.' },
          { icon: '💪', title: 'Workouts', desc: 'Discover personalized workout suggestions.' },
        ].map((f) => (
          <div key={f.title} className="col-md-4">
            <div className="feature-card">
              <h5>{f.icon} {f.title}</h5>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
