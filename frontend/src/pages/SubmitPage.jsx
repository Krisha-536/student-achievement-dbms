import React, { useState } from 'react';
import { achievementsAPI } from '../utils/api';
import './SubmitPage.css';

// Constants for dropdowns
const CATEGORIES = ['Hackathon', 'Sports', 'Cultural', 'Academic', 'Research'];
const LEVELS = ['College', 'State', 'National', 'International'];
const POSITIONS = ['1st', '2nd', '3rd', 'Finalist', 'Participant', 'Winner', 'Runner-up', 'Special Mention'];
const DEPARTMENTS = ['Computer', 'IT', 'Mechanical', 'Electrical', 'Electronics', 'Civil', 'Production', 'Textile'];

const initialForm = {
  name: '',
  roll_no: '',
  department: '',
  title: '',
  category: '',
  level: '',
  position: '',
};

/**
 * FIX: Field component defined OUTSIDE SubmitPage. 
 * This prevents the input from losing focus while typing.
 */
const Field = ({ label, name, required, children, hint, error }) => (
  <div className={`form-field ${error ? 'form-field--error' : ''}`}>
    <label className="form-label">
      {label} {required && <span className="form-required">*</span>}
    </label>
    {children}
    {error && <span className="form-error"><i className="fas fa-exclamation-circle"></i> {error}</span>}
    {hint && !error && <span className="form-hint">{hint}</span>}
  </div>
);

const SubmitPage = ({ setCurrentPage }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.roll_no.trim()) e.roll_no = 'Roll number is required';
    if (!form.department) e.department = 'Department is required';
    if (!form.title.trim()) e.title = 'Achievement title is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.level) e.level = 'Level is required';
    if (!form.position) e.position = 'Position is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      // Sends { name, roll_no, department, title, category, level, position }
      await achievementsAPI.submit(form);
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to submit. Is the server running on port 5000?' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="submit-page">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Achievement Submitted!</h2>
            <p>Your achievement has been submitted and is pending admin approval.</p>
            <div className="success-actions">
              <button className="btn-primary" onClick={() => setSuccess(false)}>
                <i className="fas fa-plus"></i> Submit Another
              </button>
              <button className="btn-secondary" onClick={() => setCurrentPage('home')}>
                <i className="fas fa-home"></i> Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page">
      <div className="container">
        <div className="submit-header">
          <button className="back-btn" onClick={() => setCurrentPage('home')}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <div>
            <h1 className="submit-title">Submit Achievement</h1>
            <p className="submit-subtitle">Celebrate your success — submit your achievement for recognition</p>
          </div>
        </div>

        <div className="submit-layout">
          <form className="submit-form" onSubmit={handleSubmit} noValidate>

            {/* Student Info Section */}
            <div className="form-section">
              <div className="form-section__header">
                <div className="form-section__icon"><i className="fas fa-user"></i></div>
                <div>
                  <h3>Student Information</h3>
                  <p>Your personal details</p>
                </div>
              </div>
              <div className="form-grid form-grid--2">
                <Field label="Full Name" name="name" required error={errors.name}>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Arjun Mehta"
                    className="form-input"
                  />
                </Field>

                <Field label="Department" name="department" required error={errors.department}>
                  <select name="department" value={form.department} onChange={handleChange} className="form-input">
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>

                <Field label="Roll Number" name="roll_no" required hint="Your enrollment number" error={errors.roll_no}>
                  <input
                    type="text"
                    name="roll_no"
                    value={form.roll_no}
                    onChange={handleChange}
                    placeholder="e.g. 211080001"
                    className="form-input"
                  />
                </Field>
              </div>
            </div>

            {/* Achievement Details Section */}
            <div className="form-section">
              <div className="form-section__header">
                <div className="form-section__icon"><i className="fas fa-trophy"></i></div>
                <div>
                  <h3>Achievement Details</h3>
                  <p>Tell us about your accomplishment</p>
                </div>
              </div>

              <div className="form-grid form-grid--1">
                <Field label="Achievement Title" name="title" required error={errors.title}>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Winner – Smart India Hackathon 2024"
                    className="form-input"
                  />
                </Field>
              </div>

              <div className="form-grid form-grid--3">
                <Field label="Category" name="category" required error={errors.category}>
                  <select name="category" value={form.category} onChange={handleChange} className="form-input">
                    <option value="">Select</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Level" name="level" required error={errors.level}>
                  <select name="level" value={form.level} onChange={handleChange} className="form-input">
                    <option value="">Select</option>
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>

                <Field label="Position / Rank" name="position" required error={errors.position}>
                  <select name="position" value={form.position} onChange={handleChange} className="form-input">
                    <option value="">Select</option>
                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {errors.submit && (
              <div className="form-submit-error">
                <i className="fas fa-exclamation-triangle"></i> {errors.submit}
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn-ghost" onClick={() => setForm(initialForm)}>
                <i className="fas fa-redo"></i> Reset
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading
                  ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</>
                  : <><i className="fas fa-paper-plane"></i> Submit Achievement</>
                }
              </button>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="submit-sidebar">
            <div className="sidebar-card">
              <h4><i className="fas fa-info-circle"></i> Guidelines</h4>
              <ul className="sidebar-list">
                <li>Ensure all information is accurate</li>
                <li>Include the official event name</li>
                <li>Entries are reviewed by administration</li>
                <li>One submission per achievement</li>
              </ul>
            </div>
            <div className="sidebar-card sidebar-card--accent">
              <h4><i className="fas fa-clock"></i> Review Timeline</h4>
              <p>Typically reviewed within <strong>3–5 working days</strong>.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;