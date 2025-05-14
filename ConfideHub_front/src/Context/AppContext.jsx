import { createContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  async function getUser() {
    if (!token) return;
    try {
      // Mock response
      // setUser({ id: 1, name: 'Test User' });
      /*
      const res = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        console.error('Failed to fetch user:', res.status);
        setUser(null);
      }
      */
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  }

  useEffect(() => {
    console.log('AppProvider: token=', token);
    if (token) getUser();
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}