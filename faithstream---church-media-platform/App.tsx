
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import Home from './pages/Home';
import Library from './pages/Library';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { AuthState, Media } from './types';

const App: React.FC = () => {
  const [auth, setAuth] = React.useState<AuthState>({
    isAdmin: localStorage.getItem('faithstream_auth') === 'true',
    user: null
  });
  const [currentMedia, setCurrentMedia] = React.useState<Media | null>(null);

  const handleLogin = (email: string) => {
    setAuth({ isAdmin: true, user: { id: '1', email } });
    localStorage.setItem('faithstream_auth', 'true');
  };

  const handleLogout = () => {
    setAuth({ isAdmin: false, user: null });
    localStorage.removeItem('faithstream_auth');
  };

  const handlePlayMedia = (media: Media) => {
    setCurrentMedia(media);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50/50 pb-32 md:pb-24">
        <Navbar isAdmin={auth.isAdmin} onLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onPlay={handlePlayMedia} />} />
            <Route path="/library" element={<Library onPlay={handlePlayMedia} />} />
            <Route 
              path="/admin/login" 
              element={auth.isAdmin ? <Navigate to="/admin" /> : <AdminLogin onLogin={handleLogin} />} 
            />
            <Route 
              path="/admin" 
              element={auth.isAdmin ? <AdminDashboard onPlay={handlePlayMedia} /> : <Navigate to="/admin/login" />} 
            />
          </Routes>
        </main>

        <footer className="bg-white border-t border-red-50 py-16 px-4 text-center">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-red-700 font-bold uppercase tracking-[0.2em] text-[10px]">
                <div className="h-px w-8 bg-red-200"></div>
                <span>Winners Chapel International, Agric Ikorodu</span>
                <div className="h-px w-8 bg-red-200"></div>
              </div>
              <p className="text-amber-600 font-bold text-xs uppercase tracking-[0.3em]">Greater Glory</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-slate-400 text-[11px]">© {new Date().getFullYear()} Living Faith Church Worldwide. Empowered for Exploits.</p>
              <p className="text-slate-300 text-[10px] uppercase tracking-widest font-medium">designed by CodedFingers</p>
            </div>
          </div>
        </footer>

        <AudioPlayer 
          media={currentMedia} 
          onClose={() => setCurrentMedia(null)} 
        />
      </div>
    </Router>
  );
};

export default App;