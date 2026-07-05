/**
 * LoginPage.tsx — Délice premium login screen
 *
 * Credentials:  delice@danon  /  dunup
 * On success:   calls onLogin() — parent sets localStorage + shows wheel
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginPageProps {
  onLogin: () => void;
}

const VALID_EMAIL    = 'delice@danon';
const VALID_PASSWORD = 'dunup';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small artificial delay for premium feel
    setTimeout(() => {
      if (email.trim() === VALID_EMAIL && password === VALID_PASSWORD) {
        onLogin();
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage:    'url(/background.jpg)',
        backgroundSize:     'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Blue overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:     'radial-gradient(ellipse at 50% 45%, rgba(0,70,180,0.32) 0%, rgba(0,40,120,0.55) 60%, rgba(0,18,68,0.72) 100%)',
          backdropFilter: 'blur(6px) brightness(0.88)',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width:      '60vw',
          height:     '60vw',
          maxWidth:   700,
          maxHeight:  700,
          background: 'radial-gradient(circle, rgba(0,120,255,0.22) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform:  'translate(-50%, -50%)',
          filter:     'blur(60px)',
        }}
      />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.94 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        style={{
          position:      'relative',
          zIndex:        10,
          width:         '100%',
          maxWidth:      420,
          background:    'linear-gradient(145deg, rgba(0,20,70,0.88) 0%, rgba(0,10,42,0.95) 100%)',
          border:        '1px solid rgba(80,160,255,0.22)',
          borderRadius:  24,
          padding:       '44px 40px 40px',
          boxShadow:     '0 0 80px rgba(0,80,255,0.28), 0 24px 80px rgba(0,0,0,0.70)',
          backdropFilter:'blur(20px)',
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Délice"
            style={{
              width:     200,
              height:    'auto',
              objectFit: 'contain',
              filter:    'drop-shadow(0 0 16px rgba(60,140,255,0.55)) drop-shadow(0 3px 10px rgba(0,0,0,0.30))',
            }}
          />
        </div>




        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="login-email"
              style={{
                display:      'block',
                fontFamily:   'var(--font-main)',
                fontSize:     11,
                fontWeight:   600,
                color:        'rgba(140,190,255,0.80)',
                letterSpacing:'0.10em',
                textTransform:'uppercase',
                marginBottom: 6,
              }}
            >
              Adresse e-mail
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="delice@danon"
              required
              style={{
                width:         '100%',
                padding:       '12px 16px',
                borderRadius:  10,
                border:        '1px solid rgba(80,150,255,0.28)',
                background:    'rgba(0,30,90,0.55)',
                color:         '#FFFFFF',
                fontFamily:    'var(--font-main)',
                fontSize:      14,
                outline:       'none',
                boxSizing:     'border-box',
                transition:    'border-color 0.2s',
              }}
              onFocus={e  => (e.target.style.borderColor = 'rgba(80,160,255,0.65)')}
              onBlur={e   => (e.target.style.borderColor = 'rgba(80,150,255,0.28)')}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24, position: 'relative' }}>
            <label
              htmlFor="login-password"
              style={{
                display:      'block',
                fontFamily:   'var(--font-main)',
                fontSize:     11,
                fontWeight:   600,
                color:        'rgba(140,190,255,0.80)',
                letterSpacing:'0.10em',
                textTransform:'uppercase',
                marginBottom: 6,
              }}
            >
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••"
                required
                style={{
                  width:         '100%',
                  padding:       '12px 44px 12px 16px',
                  borderRadius:  10,
                  border:        '1px solid rgba(80,150,255,0.28)',
                  background:    'rgba(0,30,90,0.55)',
                  color:         '#FFFFFF',
                  fontFamily:    'var(--font-main)',
                  fontSize:      14,
                  outline:       'none',
                  boxSizing:     'border-box',
                  transition:    'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(80,160,255,0.65)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(80,150,255,0.28)')}
              />
              {/* Show/hide password toggle */}
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position:   'absolute',
                  right:      12,
                  top:        '50%',
                  transform:  'translateY(-50%)',
                  background: 'none',
                  border:     'none',
                  cursor:     'pointer',
                  fontSize:   16,
                  color:      'rgba(140,190,255,0.60)',
                  padding:    4,
                }}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0  }}
                exit={{    opacity: 0, y: -6  }}
                style={{
                  fontFamily:   'var(--font-main)',
                  fontSize:     12,
                  color:        '#FF7070',
                  textAlign:    'center',
                  marginBottom: 14,
                  textShadow:   '0 0 10px rgba(255,80,80,0.40)',
                }}
              >
                ⚠️ {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.03 } : {}}
            whileTap={!loading  ? { scale: 0.97 } : {}}
            style={{
              width:         '100%',
              padding:       '14px',
              borderRadius:  9999,
              border:        '1px solid rgba(80,160,255,0.45)',
              background:    loading
                ? 'rgba(0,50,140,0.50)'
                : 'linear-gradient(135deg, #0066DD 0%, #003D99 100%)',
              color:         '#FFFFFF',
              fontFamily:    'var(--font-main)',
              fontSize:      15,
              fontWeight:    700,
              letterSpacing: '0.06em',
              cursor:        loading ? 'not-allowed' : 'pointer',
              boxShadow:     loading
                ? 'none'
                : '0 0 30px rgba(0,100,255,0.55), 0 4px 18px rgba(0,0,0,0.40)',
              transition:    'background 0.2s, box-shadow 0.2s',
            }}
          >
            {loading ? '⏳ Connexion...' : 'Se connecter'}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
};

export default LoginPage;
