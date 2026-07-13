import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { playerService } from '../services/playerService';

interface RegistrationFormProps {
  onSuccess: (player: { firstName: string; lastName: string; cin: string; phone: string }) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cin, setCin] = useState('');
  const [phone, setPhone] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Nom validation
    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!lastName.trim()) {
      newErrors.lastName = 'Le nom est obligatoire.';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Le nom doit contenir au moins 2 caractères.';
    } else if (!nameRegex.test(lastName)) {
      newErrors.lastName = 'Le nom ne doit contenir que des lettres et des espaces.';
    }

    // Prénom validation
    if (!firstName.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire.';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères.';
    } else if (!nameRegex.test(firstName)) {
      newErrors.firstName = 'Le prénom ne doit contenir que des lettres et des espaces.';
    }

    // CIN validation
    const cinRegex = /^\d{8}$/;
    if (!cin.trim()) {
      newErrors.cin = 'La CIN est obligatoire.';
    } else if (!cinRegex.test(cin)) {
      newErrors.cin = 'La CIN doit contenir exactement 8 chiffres.';
    }

    // Phone validation
    const phoneRegex = /^[24579]\d{7}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est obligatoire.';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Le numéro de téléphone doit contenir 8 chiffres et commencer par 2, 4, 5, 7 ou 9.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      // 1. Check if user already played
      const status = await playerService.checkPlayer(cin);
      if (status.exists && status.hasPlayed) {
        setGlobalError('Cette CIN a déjà participé. Une seule participation est autorisée.');
        setLoading(false);
        return;
      }

      // 2. Register/Update user
      await playerService.registerPlayer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        cin: cin.trim(),
        phone: phone.trim(),
      });

      // 3. Callback to parent
      onSuccess({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        cin: cin.trim(),
        phone: phone.trim(),
      });
    } catch (err: any) {
      setGlobalError(err.message || 'Une erreur est survenue lors de l’inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(16px) brightness(0.60)' }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-md relative overflow-hidden rounded-3xl p-[2px]"
        style={{
          background: 'linear-gradient(135deg, rgba(80,160,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Glassmorphic body */}
        <div
          className="relative rounded-[22px] p-6 sm:p-8"
          style={{
            background: 'linear-gradient(165deg, rgba(0,25,80,0.96) 0%, rgba(0,10,40,0.98) 100%)',
          }}
        >
          {/* Delice branding decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-green-500" />

          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-1.5" style={{ textShadow: '0 2px 10px rgba(80,160,255,0.3)' }}>
              Inscription au jeu
            </h2>
            <p className="text-sm text-blue-200/70 font-medium">
              Renseignez vos informations pour participer.
            </p>
          </div>

          {/* Global error message */}
          {globalError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-4 mb-5 rounded-2xl border bg-red-950/45 border-red-500/35 text-red-200 text-sm leading-relaxed"
            >
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <span>{globalError}</span>
            </motion.div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4 select-text">
            {/* Prénom */}
            <div>
              <label className="block text-xs font-bold text-blue-200/90 uppercase tracking-widest mb-1.5">
                Prénom
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-300/50">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                  disabled={loading}
                  className={`w-full bg-blue-950/40 border text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all ${
                    errors.firstName
                      ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                      : 'border-blue-500/25 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/40'
                  }`}
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-red-400 mt-1.5 font-semibold flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.firstName}
                </p>
              )}
            </div>

            {/* Nom */}
            <div>
              <label className="block text-xs font-bold text-blue-200/90 uppercase tracking-widest mb-1.5">
                Nom
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-300/50">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Votre nom"
                  disabled={loading}
                  className={`w-full bg-blue-950/40 border text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all ${
                    errors.lastName
                      ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                      : 'border-blue-500/25 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/40'
                  }`}
                />
              </div>
              {errors.lastName && (
                <p className="text-xs text-red-400 mt-1.5 font-semibold flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.lastName}
                </p>
              )}
            </div>

            {/* CIN */}
            <div>
              <label className="block text-xs font-bold text-blue-200/90 uppercase tracking-widest mb-1.5">
                CIN tunisienne
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-300/50">
                  <CreditCard size={16} />
                </span>
                <input
                  type="text"
                  maxLength={8}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={cin}
                  onChange={(e) => setCin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 08765432"
                  disabled={loading}
                  className={`w-full bg-blue-950/40 border text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all ${
                    errors.cin
                      ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                      : 'border-blue-500/25 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/40'
                  }`}
                />
              </div>
              {errors.cin && (
                <p className="text-xs text-red-400 mt-1.5 font-semibold flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.cin}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-xs font-bold text-blue-200/90 uppercase tracking-widest mb-1.5">
                Numéro de téléphone
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-300/50">
                  <Phone size={16} />
                </span>
                <input
                  type="text"
                  maxLength={8}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 20123456"
                  disabled={loading}
                  className={`w-full bg-blue-950/40 border text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all ${
                    errors.phone
                      ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                      : 'border-blue-500/25 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/40'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-400 mt-1.5 font-semibold flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.phone}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-6 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest text-white transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #0066FF 45%, #003FCC 75%)',
                boxShadow: '0 4px 18px rgba(0,100,255,0.4)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                <span>Valider et accéder à la roue</span>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <p className="text-[10px] text-blue-200/40 font-medium text-center mt-5 leading-relaxed">
            Vos informations sont utilisées uniquement dans le cadre de cette opération promotionnelle.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
