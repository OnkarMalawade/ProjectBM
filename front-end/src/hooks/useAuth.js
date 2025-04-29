import { useState, useEffect } from 'react';
import { getToken } from '../utils/storage';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  return { isAuthenticated };
};

export default useAuth;
