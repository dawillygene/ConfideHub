// Context/AppProvider.js
import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext({
  user: undefined,
  setUser: () => {},
});

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); 

  useEffect(() => {
 
    fetch('/api/auth/user', {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const payload = await res.json();
          setUser(payload.username);
        } else {
          setUser(null); 
          localStorage.removeItem('isLoggedIn'); 
        }
      })
      .catch(() => setUser(null) , localStorage.removeItem('isLoggedIn')); 
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;