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
    contraseña: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        
        
        toast.success('Código de verificación enviado a tu correo');
      } catch (error) {
        toast.error('Error al enviar el código de verificación');
        console.error('Error al enviar el código de verificación:', error);
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
      console.log('Datos del usuario:', userData);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Error al registrar el usuario');
        }
        navigate('/login');
  
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error en la autenticación:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const validateForm = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // Validar que todos los campos estén llenos
    if (!formData.nombres || !formData.apellidos || !formData.email || !formData.contraseña || !formData.confirmarContraseña) {
      toast.error('Por favor, completa todos los campos');
      return false;
    }
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor, ingresa un email válido');
      return false;
    }

    // Validar que las contraseñas coincidan
    if (formData.contraseña !== formData.confirmarContraseña) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }
    // Validar longitud mínima de contraseña
    if (!passwordRegex.test(formData.contraseña)) {
      toast.error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
      return false;
    } 
    // Validar términos y condiciones
    if (!formData.aceptaTerminos) {
      toast.error('Debes aceptar los términos y condiciones');
      return false;
    }

    return true;
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
                name="contraseña"
                placeholder="Contraseña"
                value={formData.contraseña}
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
                Registrate
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
            {error && <p className="error-message">{error}</p>}
        </div> 
        </form>
      </div>
    </div>
  );
}

export default Login;
