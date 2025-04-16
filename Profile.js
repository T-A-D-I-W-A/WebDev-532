import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const API_KEY = 'EXAM2024-KEY-5678';

  // Fetch user profile
  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/profile?userId=${userId}`, {
        headers: {
          'X-API-Key': API_KEY
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setProfile(data);
      setNewUsername(data.username);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update username
  const updateUsername = async () => {
    // Validate username
    if (!newUsername || newUsername.trim() === '') {
      setUsernameError('Username cannot be empty');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUsernameError('');

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({
          userId,
          username: newUsername
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update username');
      }

      setProfile(data);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUsername();
  };

  // Cancel edit mode
  const handleCancel = () => {
    setEditMode(false);
    setNewUsername(profile.username);
    setUsernameError('');
  };

  // Load profile on component mount
  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (!userId) {
    return <p>Please log in to view your profile.</p>;
  }

  if (isLoading && !profile) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error && !profile) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchProfile} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      {profile && (
        <div className="profile-card">
          {editMode ? (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className={usernameError ? 'invalid' : ''}
                />
                {usernameError && <div className="error">{usernameError}</div>}
              </div>
              
              <div className="button-group">
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="profile-info">
                <div className="profile-field">
                  <span className="field-label">Username:</span>
                  <span className="field-value">{profile.username}</span>
                </div>
                
                <div className="profile-field">
                  <span className="field-label">Email:</span>
                  <span className="field-value">{profile.email}</span>
                </div>
                
                <div className="profile-field">
                  <span className="field-label">User ID:</span>
                  <span className="field-value">{profile.id}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setEditMode(true)} 
                className="edit-button"
                disabled={isLoading}
              >
                Edit Username
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;