import React, { useState, useEffect } from 'react';
import AchievementCard from '../components/AchievementCard';
import { achievementsAPI } from '../utils/api';
import './HomePage.css';

const CATEGORIES = ['All', 'Hackathon', 'Sports', 'Cultural', 'Academic', 'Research'];
const LEVELS = ['All', 'College', 'State', 'National', 'International'];

const stats = [
  { label: 'Total Achievements', value: '128+', icon: 'fa-trophy' },
  { label: 'Students Recognized', value: '94', icon: 'fa-user-graduate' },
  { label: 'International Awards', value: '17', icon: 'fa-globe' },
  { label: 'Departments', value: '8', icon: 'fa-building-columns' },
];

const HomePage = ({ setCurrentPage }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError(null);
        // GET /api/ — returns approved achievements from DB
        const data = await achievementsAPI.getApproved();
        setAchievements(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Could not load achievements. Make sure the server is running on port 5000.');
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const filtered = achievements.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchLvl = activeLevel === 'All' || a.level === activeLevel;
    const matchSearch = !searchQuery ||
      a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchLvl && matchSearch;
  });

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__pattern"></div>
        <div className="container hero__inner">
          <div className="hero__badge">
            <i className="fas fa-award"></i> Est. 1887
          </div>
          <h1 className="hero__title">
            Student Achievements<br />
            <em>Portal</em>
          </h1>
          <p className="hero__sub">
            Celebrating the extraordinary accomplishments of VJTI students across academics,
            sports, technology, and culture.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={() => setCurrentPage('submit')}>
              <i className="fas fa-upload"></i> Submit Achievement
            </button>
            <button className="btn btn--outline" onClick={() => document.getElementById('achievements').scrollIntoView({ behavior: 'smooth' })}>
              <i className="fas fa-arrow-down"></i> Browse All
            </button>
          </div>
        </div>
        <div className="hero__wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--off-white)" />
          </svg>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats">
        <div className="container stats__grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-item__icon">
                <i className={`fas ${s.icon}`}></i>
              </div>
              <div className="stat-item__value">{s.value}</div>
              <div className="stat-item__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements-section" id="achievements">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Hall of Excellence</h2>
              <p className="section-sub">Approved achievements by our distinguished students</p>
            </div>
          </div>

          {/* Filters */}
          <div className="filters">
            <div className="filters__search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by name or title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="filters__clear" onClick={() => setSearchQuery('')}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <div className="filters__groups">
              <div className="filter-group">
                <span className="filter-label">Category</span>
                <div className="filter-pills">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      className={`filter-pill ${activeCategory === c ? 'filter-pill--active' : ''}`}
                      onClick={() => setActiveCategory(c)}
                    >{c}</button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <span className="filter-label">Level</span>
                <div className="filter-pills">
                  {LEVELS.map(l => (
                    <button
                      key={l}
                      className={`filter-pill ${activeLevel === l ? 'filter-pill--active' : ''}`}
                      onClick={() => setActiveLevel(l)}
                    >{l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading / Error / Empty / Cards */}
          {loading ? (
            <div className="state-box">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading achievements...</p>
            </div>
          ) : error ? (
            <div className="state-box state-box--error">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button className="btn-retry" onClick={() => window.location.reload()}>
                <i className="fas fa-redo"></i> Retry
              </button>
            </div>
          ) : (
            <>
              <div className="results-count">
                Showing <strong>{filtered.length}</strong> achievement{filtered.length !== 1 ? 's' : ''}
                {activeCategory !== 'All' && ` in ${activeCategory}`}
                {activeLevel !== 'All' && ` at ${activeLevel} level`}
              </div>
              {filtered.length > 0 ? (
                <div className="cards-grid">
                  {filtered.map((a, i) => (
                    <AchievementCard key={a.id || i} achievement={a} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-search"></i>
                  <h3>No achievements found</h3>
                  <p>Try adjusting your filters or search query</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <span className="footer__logo">VJTI</span>
            <p>Veermata Jijabai Technological Institute, Mumbai</p>
          </div>
          <div className="footer__links">
            <a href="https://vjti.ac.in" target="_blank" rel="noreferrer">Official Website</a>
            <span>|</span>
            <a href="#">Contact Dean</a>
            <span>|</span>
            <a href="#">Guidelines</a>
          </div>
          <p className="footer__copy">© 2025 VJTI Mumbai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
