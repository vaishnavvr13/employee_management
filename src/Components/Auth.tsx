import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(JSON.parse(localStorage.getItem("isLoggedIn")??"false"));
  
  const checkUserIsLoggedIn = async ()=>{
    try {
        const res = await fetch('http://localhost:3000/api/users/currentuser', { credentials: 'include' });
        const data = await res.json();
        console.log(!!data.currentUser.id,"wrinngle");
        setIsAuthenticated(!!data.currentUser.id);
        localStorage.setItem("isLoggedIn",JSON.stringify(!!data?.currentUser?.id))
      } catch {
        setIsAuthenticated(false);
        localStorage.setItem("isLoggedIn",JSON.stringify(false))
      }
  }

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/api/users/signout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setIsAuthenticated(false);
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
    }
  };
  
  useEffect(() => {
    checkUserIsLoggedIn()
  }, [])

  return { isAuthenticated, logout };
};
