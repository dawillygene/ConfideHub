import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/user', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.username);
      } else {
        setUser(null);
        navigate('/auth', { replace: true });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      navigate('/auth', { replace: true });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}