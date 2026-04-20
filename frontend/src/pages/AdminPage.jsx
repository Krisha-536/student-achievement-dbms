import React, { useState, useEffect } from 'react';
import { achievementsAPI } from '../utils/api';
import './AdminPage.css';

// DB columns returned: id, name, roll_no, title, category, level, position, status

const StatusBadge = ({ status }) => {
  const config = {
    approved: { cls: 'badge--approved', icon: 'fa-check-circle', label: 'Approved' },
    pending:  { cls: 'badge--pending',  icon: 'fa-clock',        label: 'Pending'  },
    rejected: { cls: 'badge--rejected', icon: 'fa-times-circle', label: 'Rejected' },
  };
  const key = status?.toLowerCase();
  const c = config[key] || config.pending;
  return (
    <span className={`status-badge ${c.cls}`}>
      <i className={`fas ${c.icon}`}></i> {c.label}
    </span>
  );
};

const AdminPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load ALL submissions (pending + approved) for admin view
  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch both approved and pending in parallel
      const [approved, pending] = await Promise.all([
        achievementsAPI.getApproved(),   // GET /api/
        achievementsAPI.getPending(),     // GET /api/pending
      ]);
      const all = [
        ...(Array.isArray(approved) ? approved : []),
        ...(Array.isArray(pending) ? pending : []),
      ];
      // Deduplicate by id (in case of overlap)
      const seen = new Set();
      const deduped = all.filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true; });
      setAchievements(deduped);
    } catch (err) {
      setError('Could not connect to server. Make sure your backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const updateStatus = async (id, status) => {
    setActionLoading(prev => ({ ...prev, [id]: status }));
    try {
      // PUT /api/update/:id  body: { status }
      await achievementsAPI.updateStatus(id, status);
      setAchievements(prev =>
        prev.map(a => a.id === id ? { ...a, status } : a)
      );
      showToast(`Achievement ${status} successfully.`, status === 'approved' ? 'success' : 'error');
    } catch (err) {
      showToast(err.message || 'Action failed. Please try again.', 'error');
    } finally {
      setActionLoading(prev => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  const filtered = achievements.filter(a => {
    const matchStatus = filterStatus === 'All' || a.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchSearch = !searchQuery ||
      a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.roll_no?.toString().includes(searchQuery) ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    All:      achievements.length,
    Pending:  achievements.filter(a => a.status?.toLowerCase() === 'pending').length,
    Approved: achievements.filter(a => a.status?.toLowerCase() === 'approved').length,
    Rejected: achievements.filter(a => a.status?.toLowerCase() === 'rejected').length,
  };

  return (
    <div className="admin-page">
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {toast.msg}
        </div>
      )}

      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Panel</h1>
            <p className="admin-sub">Review and manage student achievement submissions</p>
          </div>
          <div className="admin-header__badge">
            <i className="fas fa-shield-halved"></i> Restricted Access
          </div>
        </div>

        {/* Stat Cards */}
        <div className="admin-stats">
          {[
            { label: 'Total',    value: counts.All,      icon: 'fa-list',  color: 'default'  },
            { label: 'Pending',  value: counts.Pending,  icon: 'fa-clock', color: 'pending'  },
            { label: 'Approved', value: counts.Approved, icon: 'fa-check', color: 'approved' },
            { label: 'Rejected', value: counts.Rejected, icon: 'fa-times', color: 'rejected' },
          ].map(s => (
            <div key={s.label} className={`admin-stat admin-stat--${s.color}`}>
              <div className="admin-stat__icon"><i className={`fas ${s.icon}`}></i></div>
              <div className="admin-stat__value">{s.value}</div>
              <div className="admin-stat__label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="toolbar-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, roll number, or title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="toolbar-filters">
            {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
              <button
                key={s}
                className={`toolbar-filter ${filterStatus === s ? 'toolbar-filter--active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s} <span className="toolbar-filter__count">{counts[s]}</span>
              </button>
            ))}
          </div>
          <button className="btn-refresh" onClick={fetchAll} title="Refresh">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="admin-loading">
            <i className="fas fa-spinner fa-spin"></i> Loading submissions...
          </div>
        ) : error ? (
          <div className="admin-error">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button className="btn-refresh" onClick={fetchAll}>
              <i className="fas fa-redo"></i> Retry
            </button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Achievement</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="table-empty">
                      <i className="fas fa-inbox"></i>
                      <span>No submissions found</span>
                    </td>
                  </tr>
                ) : (
                  filtered.map((a, i) => (
                    <tr key={a.id} className="table-row">
                      <td className="id-cell">{a.id}</td>
                      <td>
                        <div className="student-cell">
                          <div className="student-cell__avatar">{a.name?.charAt(0).toUpperCase() || '?'}</div>
                          <div>
                            <div className="student-cell__name">{a.name}</div>
                            <div className="student-cell__meta">{a.roll_no}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="title-cell__title">{a.title}</div>
                      </td>
                      <td><span className="cat-tag">{a.category}</span></td>
                      <td><span className={`level-tag level-tag--${a.level?.toLowerCase()}`}>{a.level}</span></td>
                      <td><span className="position-cell">{a.position}</span></td>
                      <td><StatusBadge status={a.status} /></td>
                      <td>
                        <div className="action-btns">
                          {a.status?.toLowerCase() !== 'approved' && (
                            <button
                              className="action-btn action-btn--approve"
                              onClick={() => updateStatus(a.id, 'approved')}
                              disabled={!!actionLoading[a.id]}
                              title="Approve"
                            >
                              {actionLoading[a.id] === 'approved'
                                ? <i className="fas fa-spinner fa-spin"></i>
                                : <i className="fas fa-check"></i>}
                            </button>
                          )}
                          {a.status?.toLowerCase() !== 'rejected' && (
                            <button
                              className="action-btn action-btn--reject"
                              onClick={() => updateStatus(a.id, 'rejected')}
                              disabled={!!actionLoading[a.id]}
                              title="Reject"
                            >
                              {actionLoading[a.id] === 'rejected'
                                ? <i className="fas fa-spinner fa-spin"></i>
                                : <i className="fas fa-times"></i>}
                            </button>
                          )}
                          {a.status?.toLowerCase() !== 'pending' && (
                            <button
                              className="action-btn action-btn--reset"
                              onClick={() => updateStatus(a.id, 'pending')}
                              disabled={!!actionLoading[a.id]}
                              title="Reset to Pending"
                            >
                              <i className="fas fa-undo"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="table-footer">
          Showing <strong>{filtered.length}</strong> of <strong>{achievements.length}</strong> submissions
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
