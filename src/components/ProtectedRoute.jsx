import { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('token');
  const toastShown = useRef(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/validate-token`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Token inválido o expirado');
        }

        setIsValid(true);
      } catch (error) {
        console.error('Error al validar el token:', error);
        setIsValid(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsValid(false);
    }
  }, [token]);

  if (isValid === null) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem ', fontWeight: 'bold'}}>Cargando...</div>; 
  }

  if (!isValid) {
    localStorage.removeItem('token');
    if (!toastShown.current) {
        toast.error('Tu sesión ha expirado');
        toastShown.current = true; 
      }
    return <Navigate to="/login" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;