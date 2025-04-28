import React, { useState } from 'react';
import AuthForm from './AuthForm';
import Profile from './Profile';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      <header>
        <h1>Web Application Development</h1>
      </header>
      <main>
        {user ? (
          <Profile user={user} onLogout={handleLogout} />
        ) : (
          <AuthForm onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
}

export default App;