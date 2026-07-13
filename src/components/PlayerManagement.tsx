import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit, Trash2, X, AlertCircle, CheckCircle, Filter, Users, Loader2 } from 'lucide-react';
import { playerService } from '../services/playerService';
import type { Player } from '../services/playerService';

interface PlayerManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayersUpdated?: () => void; // Triggered when players are reset or modified to keep total counters in sync
}

export const PlayerManagement: React.FC<PlayerManagementProps> = ({ isOpen, onClose, onPlayersUpdated }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'played' | 'not_played'>('all');
  const [prizeFilter, setPrizeFilter] = useState('all');

  // Edit / Delete states
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);

  // Form states for Editing
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editCin, setEditCin] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPlayers();
    }
  }, [isOpen]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const list = await playerService.getAllPlayers();
      setPlayers(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleEditClick = (player: Player) => {
    setEditingPlayer(player);
    setEditFirstName(player.firstName);
    setEditLastName(player.lastName);
    setEditCin(player.cin);
    setEditPhone(player.phone);
    setEditError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    // Validation
    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!editFirstName.trim() || !editLastName.trim()) {
      setEditError('Le prénom et le nom sont obligatoires.');
      return;
    }
    if (editFirstName.trim().length < 2 || editLastName.trim().length < 2) {
      setEditError('Le prénom et le nom doivent contenir au moins 2 caractères.');
      return;
    }
    if (!nameRegex.test(editFirstName) || !nameRegex.test(editLastName)) {
      setEditError('Les noms ne doivent contenir que des lettres.');
      return;
    }
    if (!/^\d{8}$/.test(editCin)) {
      setEditError('La CIN doit contenir exactement 8 chiffres.');
      return;
    }
    if (!/^[24579]\d{7}$/.test(editPhone)) {
      setEditError('Le téléphone doit contenir exactement 8 chiffres et commencer par 2, 4, 5, 7 ou 9.');
      return;
    }

    if (!window.confirm('Confirmer la modification de ce participant ?')) {
      return;
    }

    try {
      if (editingPlayer) {
        await playerService.updatePlayer(editingPlayer.id, {
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
          cin: editCin.trim(),
          phone: editPhone.trim(),
        });
        showNotification('Participant modifié avec succès.');
        setEditingPlayer(null);
        fetchPlayers();
        if (onPlayersUpdated) onPlayersUpdated();
      }
    } catch (err: any) {
      setEditError(err.message || 'Une erreur est survenue lors de la modification.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPlayer) return;
    try {
      await playerService.deletePlayer(deletingPlayer.id);
      showNotification('Participant supprimé avec succès.');
      setDeletingPlayer(null);
      fetchPlayers();
      if (onPlayersUpdated) onPlayersUpdated();
    } catch (err: any) {
      alert(err.message || 'Une erreur est survenue lors de la suppression.');
    }
  };

  // Filter and Search logic
  const filteredPlayers = players.filter(p => {
    // Search filter
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.cin.includes(term) ||
      p.phone.includes(term);

    // Status filter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'played' && p.hasPlayed) ||
      (statusFilter === 'not_played' && !p.hasPlayed);

    // Prize filter
    const matchesPrize =
      prizeFilter === 'all' ||
      (prizeFilter === 'any' && p.hasPlayed && p.prizeName) ||
      (prizeFilter === p.prizeId);

    return matchesSearch && matchesStatus && matchesPrize;
  });

  // Extract unique prizes won for filters
  const availablePrizes = Array.from(
    new Map(
      players
        .filter(p => p.hasPlayed && p.prizeId && p.prizeName)
        .map(p => [p.prizeId, p.prizeName])
    ).entries()
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(20px) brightness(0.5)' }}>
      {/* Container Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-5xl rounded-3xl overflow-hidden p-[1.5px] relative"
        style={{
          background: 'linear-gradient(135deg, rgba(80,160,255,0.3) 0%, rgba(255,255,255,0.08) 100%)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Main Body */}
        <div
          className="rounded-[22px] overflow-hidden flex flex-col flex-1 p-5 sm:p-6"
          style={{
            background: 'linear-gradient(165deg, rgba(0,18,60,0.97) 0%, rgba(0,8,30,0.99) 100%)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-blue-500/15 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Users size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  Gestion des participants
                </h2>
                <p className="text-xs text-blue-200/50 font-medium">
                  {players.length} participant(s) enregistré(s) au total.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-300 hover:bg-blue-500/25 hover:text-white cursor-pointer transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Alert Notification */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3.5 mb-4 rounded-xl border bg-green-950/45 border-green-500/35 text-green-200 text-sm font-semibold"
              >
                <CheckCircle size={18} className="text-green-400" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search and Filters Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5 select-text">
            {/* Search Input */}
            <div className="relative md:col-span-6">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-300/40">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, CIN ou téléphone"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-blue-950/30 border border-blue-500/15 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/20 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative md:col-span-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-300/40">
                <Filter size={14} />
              </span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="w-full bg-blue-950/40 border border-blue-500/15 text-white text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none cursor-pointer focus:border-blue-400/40"
              >
                <option value="all">Statut : Tous</option>
                <option value="played">A joué</option>
                <option value="not_played">N'a pas joué</option>
              </select>
            </div>

            {/* Prize Filter */}
            <div className="relative md:col-span-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-300/40">
                <Filter size={14} />
              </span>
              <select
                value={prizeFilter}
                onChange={e => setPrizeFilter(e.target.value)}
                className="w-full bg-blue-950/40 border border-blue-500/15 text-white text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none cursor-pointer focus:border-blue-400/40"
              >
                <option value="all">Cadeau : Tous</option>
                <option value="any">Tous les gagnants</option>
                {availablePrizes.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto rounded-2xl border border-blue-500/15 bg-blue-950/10 select-text">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-blue-300/60">
                <Loader2 size={32} className="animate-spin" />
                <span className="text-sm font-semibold">Chargement des participants...</span>
              </div>
            ) : filteredPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-blue-300/40">
                <AlertCircle size={32} className="mb-2" />
                <span className="text-sm font-semibold">Aucun participant trouvé.</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-blue-500/15 text-blue-200/60 text-xs font-bold uppercase tracking-wider bg-blue-950/40">
                    <th className="py-3.5 px-4">Nom</th>
                    <th className="py-3.5 px-4">Prénom</th>
                    <th className="py-3.5 px-4">CIN</th>
                    <th className="py-3.5 px-4">Téléphone</th>
                    <th className="py-3.5 px-4">Statut</th>
                    <th className="py-3.5 px-4">Cadeau Gagné</th>
                    <th className="py-3.5 px-4">Date Part.</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10 text-white text-sm">
                  {filteredPlayers.map(p => (
                    <tr key={p.id} className="hover:bg-blue-500/5 transition-all">
                      <td className="py-3 px-4 font-bold">{p.lastName}</td>
                      <td className="py-3 px-4 font-semibold">{p.firstName}</td>
                      <td className="py-3 px-4 font-mono text-blue-200/80">{p.cin}</td>
                      <td className="py-3 px-4 font-mono text-blue-200/80">{p.phone}</td>
                      <td className="py-3 px-4">
                        {p.hasPlayed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400">
                            A joué
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-500/10 border border-sky-500/20 text-sky-400">
                            N'a pas joué
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {p.prizeName ? (
                          <span className="text-white font-bold">{p.prizeName}</span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-white/50">
                        {p.playedAt ? new Date(p.playedAt).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : <span className="text-white/20">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            title="Modifier"
                            className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-300 hover:bg-blue-500/30 hover:text-white cursor-pointer transition-all"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingPlayer(p)}
                            title="Supprimer"
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-300 hover:bg-red-500/30 hover:text-white cursor-pointer transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </motion.div>

      {/* Editing Overlay Modal */}
      <AnimatePresence>
        {editingPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-[2px] relative"
              style={{
                background: 'linear-gradient(135deg, rgba(80,160,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
              }}
            >
              <div className="rounded-[15px] p-6 bg-slate-950 border border-blue-500/20 select-text">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/15 mb-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    Modifier le participant
                  </h3>
                  <button onClick={() => setEditingPlayer(null)} className="text-blue-300/70 hover:text-white cursor-pointer">
                    <X size={18} />
                  </button>
                </div>

                {editError && (
                  <div className="flex items-start gap-2 p-3 mb-4 rounded-xl border bg-red-950/45 border-red-500/35 text-red-200 text-xs">
                    <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                    <span>{editError}</span>
                  </div>
                )}

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  {/* Prénom */}
                  <div>
                    <label className="block text-xs font-bold text-blue-200/90 uppercase tracking-widest mb-1.5">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={editFirstName}
                      onChange={e => setEditFirstName(e.target.value)}
                      className="w-full bg-blue-950/40 border border-blue-500/25 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Nom */}
                  <div>
                    <label className="block text-xs font-bold text-blue-200/90 uppercase tracking-widest mb-1.5">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={editLastName}
                      onChange={e => setEditLastName(e.target.value)}
                      className="w-full bg-blue-950/40 border border-blue-500/25 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* CIN */}
                  <div>
                    <label className="block text-xs font-bold text-blue-200/90 uppercase tracking-widest mb-1.5">
                      CIN tunisienne
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={editCin}
                      onChange={e => setEditCin(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-blue-950/40 border border-blue-500/25 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-blue-200/90 uppercase tracking-widest mb-1.5">
                      Numéro de téléphone
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-blue-950/40 border border-blue-500/25 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-400"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingPlayer(null)}
                      className="flex-1 py-2.5 border border-blue-500/20 text-blue-300 hover:text-white rounded-xl text-sm font-bold uppercase transition-all cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl text-sm font-bold uppercase transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deletion Confirmation Dialog */}
      <AnimatePresence>
        {deletingPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-[1.5px] bg-gradient-to-br from-red-500/50 to-red-950"
            >
              <div className="rounded-[14px] p-5 bg-slate-950 text-center select-text">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-3">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
                  Supprimer le participant
                </h3>
                <p className="text-sm text-red-200/70 leading-relaxed mb-6">
                  Voulez-vous vraiment supprimer ce participant ? Cette action est irréversible.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeletingPlayer(null)}
                    className="flex-1 py-2.5 border border-blue-500/20 text-blue-300 hover:text-white rounded-xl text-sm font-bold uppercase cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold uppercase cursor-pointer shadow-lg shadow-red-600/30"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
