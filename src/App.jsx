import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './styles/app.css';

// Importa tus páginas y componentes principales
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Roadmap from './pages/Roadmap';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';

function App() {
  return (
    <>
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #835bfc'
        },
        success: {
          iconTheme: {
            primary: '#835bfc',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff5757',
            secondary: '#fff',
          },
        }
      }}
    />
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About/>} />
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
