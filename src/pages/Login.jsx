import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import googleIcon from '../assets/google.png';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordSubmitting, setIsForgotPasswordSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail);
        }
        const data = await response.json();
        const token = data.access_token;
        localStorage.setItem('token', token);
        navigate('/roadmap');
        window.location.reload('/roadmap');
        
      } catch (error) {
        toast.error(error.message);
        console.error('Error al iniciar sesión:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userData = {
        email: result.user.email,      
        name: result.user.displayName,       
        provider: 'google',                    
      };
      
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login-google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Error al iniciar sesión');
        }
        const data = await response.json();
        const token = data.access_token;
        localStorage.setItem('token', token);
        navigate('/roadmap');
        window.location.reload('/roadmap');
  
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error en la autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const validateForm = () => {
    if(!formData.email || !formData.password) {
      toast.error('Por favor, completa todos los campos');
      return false;
    }

    return true;
  };

  const handleForgotPassword = async () => {

    if(!forgotPasswordEmail) {
      toast.error('Por favor, ingresa tu correo electrónico');
      return;
    }
    if(!forgotPasswordEmail.includes('@')) {
      toast.error('Por favor, ingresa un correo electrónico válido');
      return;
    }

    setIsForgotPasswordSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
      setForgotPasswordEmail('');
      setShowForgotPassword(false);
      toast.success('Correo enviado correctamente');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsForgotPasswordSubmitting(false);
    }
  };

  return (
    <div className="register-container">
        <div className="light-orb" style={{ '--delay': '0s' }}></div>
        <div className="light-orb" style={{ '--delay': '1s' }}></div>
        <div className="light-orb" style={{ '--delay': '2s' }}></div>
        <div className="light-orb" style={{ '--delay': '3s' }}></div>
        <div className="light-orb" style={{ '--delay': '4s' }}></div>

      <div className="register-box">
        <h1 className="register-title">Inicia sesión</h1>
        <h2 className="register-subtitle">Ingresa tus datos</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ingresa tu correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

        <div className="form-group">
            <label>Ingresa tu contraseña</label>
            <div className="password-input-wrapper">
                <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
                />
                <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>

            <div className="have-account" style={{marginBottom: '1rem'}}>
              <span className="have-account-text">¿No tienes una cuenta?</span>
              <span className="login-link" onClick={() => navigate('/register')}>
                Regístrate
              </span>
              
            </div>

            <div className="forgot-password">
              <span className="login-link" onClick={() => setShowForgotPassword(true)} style={{marginTop: '0.5rem'}}>
                ¿Olvidaste tu contraseña?
              </span>
            </div>

        <div className="button-container">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Continuar'}
          </button>

            <button
            type="button"
            className="google-button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            >
            {isLoading ? 'Cargando...' : (
              <>
                <img src={googleIcon} alt="Google" className="google-icon" />
                Inicia sesión con Google
              </>
            )}
            </button>
        </div> 
        </form>

        {showForgotPassword && (
          <div className="verification-modal">
            <div className="modal-content">
              <h2>Ingresa tu correo asociado a tu cuenta</h2>
              <input 
                type="email" 
                name="email" 
                value={forgotPasswordEmail} 
                onChange={(e) => setForgotPasswordEmail(e.target.value)} 
                placeholder="Correo electrónico"
                required
                className="forgot-password-input"
              />
              <div className="modal-buttons">
                <button type="button" className="cancel-button" onClick={() => setShowForgotPassword(false)}>Cancelar</button>
                <button 
                  type="submit" 
                  className="submit-button" 
                  onClick={() => handleForgotPassword()}
                  disabled={isForgotPasswordSubmitting}
                >
                  {isForgotPasswordSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
