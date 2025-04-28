import React, { useState, useEffect } from 'react';
import './Profile.css';

function Profile({ user, onLogout }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/profile?userId=${user.id}`, {
        headers: {
          'X-API-Key': 'EXAM2024-KEY-5678'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to fetch profile data');
        setLoading(false);
        return;
      }

      setProfileData(data);
      setLoading(false);
    } catch (error) {
      setError('Server connection error');
      setLoading(false);
    }
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setUpdateError('');
    
    if (!newUsername) {
      setUpdateError('Username cannot be empty');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setUpdateError('Username must not contain special characters');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'EXAM2024-KEY-5678'
        },
        body: JSON.stringify({
          userId: user.id,
          username: newUsername
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setUpdateError(data.error || 'Failed to update username');
        return;
      }

      setProfileData(data);
      setNewUsername('');
    } catch (error) {
      setUpdateError('Server connection error');
    }
  };

  if (loading) {
    return <div>Loading profile data...</div>;
  }

  if (error) {
    return (
      <div className="profile-container error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={onLogout}>Back to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      
      {profileData && (
        <div className="profile-info">
          <p><strong>Username:</strong> {profileData.username}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>User ID:</strong> {profileData.id}</p>
        </div>
      )}
      
      <div className="update-username">
        <h3>Update Username</h3>
        {updateError && <div className="error-message">{updateError}</div>}
        
        <form onSubmit={handleUpdateUsername}>
          <div className="form-group">
            <label htmlFor="newUsername">New Username</label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-button">Update Username</button>
        </form>
      </div>
      
      <button onClick={onLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default Profile;