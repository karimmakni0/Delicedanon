import React, { useState, useMemo } from 'react';
import SpinWheel from './components/SpinWheel';
import LoginPage from './components/LoginPage';

const AUTH_KEY = 'delice_logged_in';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem(AUTH_KEY) === 'true'
  );

  const handleLogin = () => {
    localStorage.setItem(AUTH_KEY, 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
  };

  const bubbles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, idx) => {
      const left     = `${Math.random() * 100}%`;
      const size     = `${Math.random() * 14 + 4}px`;
      const delay    = `${Math.random() * 16}s`;
      const duration = `${Math.random() * 8 + 12}s`;
      const opacity  = Math.random() * 0.3 + 0.1;
      return { idx, left, size, delay, duration, opacity };
    });
  }, []);

  // Login page has its own background — render without the wheel shell
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-x-hidden select-none"
      style={{
        backgroundImage:    'url(/background.jpg)',
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        backgroundRepeat:   'no-repeat',
      }}
    >
      {/* ── Blue gradient overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none page-bg-overlay"
        style={{
          background:     'radial-gradient(ellipse at 50% 45%, rgba(0,70,180,0.32) 0%, rgba(0,40,120,0.50) 60%, rgba(0,18,68,0.65) 100%)',
          backdropFilter: 'blur(6px) brightness(0.94)',
        }}
      />

      {/* ── Radial spotlight ── */}
      <div
        className="wheel-bloom absolute rounded-full pointer-events-none"
        style={{
          width:      'min(75vw, 720px)',
          height:     'min(75vw, 720px)',
          background: 'radial-gradient(circle, rgba(0,160,255,0.28) 0%, rgba(0,87,184,0.12) 45%, transparent 70%)',
          top:        '50%',
          left:       '50%',
          filter:     'blur(40px)',
        }}
      />

      {/* ── Ambient light rays ── */}
      <div className="light-ray-overlay absolute inset-0 pointer-events-none opacity-[0.18]" />

      {/* ── Dot-grid texture ── */}
      <div className="dot-grid absolute inset-0 pointer-events-none" />

      {/* ── Floating dairy bubbles ── */}
      {bubbles.map((b) => (
        <div
          key={b.idx}
          className="particle"
          style={{
            left:              b.left,
            width:             b.size,
            height:            b.size,
            animationDelay:    b.delay,
            animationDuration: b.duration,
            opacity:           b.opacity,
          }}
        />
      ))}

      {/* ── Flowing milk waves at bottom ── */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none h-[14vh]">
        <svg
          className="cream-wave absolute bottom-0 left-0 w-[200%] h-full opacity-35"
          viewBox="0 0 1440 200" preserveAspectRatio="none" fill="none"
        >
          <path d="M0,120 C320,180 640,60 960,140 C1280,220 1600,100 1920,160 L1920,200 L0,200 Z" fill="#0057B8" />
        </svg>
        <svg
          className="cream-wave-fast absolute bottom-[-8px] left-0 w-[200%] h-[88%] opacity-15"
          viewBox="0 0 1440 200" preserveAspectRatio="none" fill="none"
        >
          <path d="M0,140 C360,60 720,180 1080,100 C1440,20 1800,160 2160,120 L2160,200 L0,200 Z" fill="#43A047" />
        </svg>
        <svg
          className="cream-wave absolute bottom-[-16px] left-0 w-[200%] h-[78%] opacity-15"
          viewBox="0 0 1440 200" preserveAspectRatio="none" fill="none"
        >
          <path d="M0,160 C300,100 600,180 900,140 C1200,100 1500,160 1800,120 L1800,200 L0,200 Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ── Game content ── */}
      <div className="z-10 w-full max-w-5xl flex items-center justify-center">
        <SpinWheel onLogout={handleLogout} />
      </div>

      {/* ── Vignette edges ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 38%, rgba(0,5,25,0.65) 100%)',
        }}
      />
    </main>
  );
};

export default App;
