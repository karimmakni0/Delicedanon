export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  cin: string;
  phone: string;
  hasPlayed: boolean;
  prizeId?: string;
  prizeName?: string;
  playedAt?: string;
  createdAt: string;
}

const STORAGE_KEY = 'delice_registered_players';

// Simulated API latency for a realistic network feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const playerService = {
  /**
   * Checks if a player with this CIN exists and if they have already played.
   * POST /api/players/check
   */
  async checkPlayer(cin: string): Promise<{ exists: boolean; hasPlayed: boolean }> {
    await delay(300);
    const players: Player[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const player = players.find(p => p.cin === cin.trim());
    if (!player) {
      return { exists: false, hasPlayed: false };
    }
    return { exists: true, hasPlayed: player.hasPlayed };
  },

  /**
   * Registers a new player if the CIN is not already registered.
   * POST /api/players/register
   */
  async registerPlayer(data: { firstName: string; lastName: string; cin: string; phone: string }): Promise<void> {
    await delay(400);
    const players: Player[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const cleanCin = data.cin.trim();
    
    // Server-side unique validation simulation
    const existingPlayer = players.find(p => p.cin === cleanCin);
    if (existingPlayer) {
      if (existingPlayer.hasPlayed) {
        throw new Error('Cette CIN a déjà participé. Une seule participation est autorisée.');
      }
      // If registered but has NOT played, update details if changed, and allow entering the wheel
      existingPlayer.firstName = data.firstName.trim();
      existingPlayer.lastName = data.lastName.trim();
      existingPlayer.phone = data.phone.trim();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
      return;
    }

    const newPlayer: Player = {
      id: 'plr_' + Math.random().toString(36).substring(2, 9),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      cin: cleanCin,
      phone: data.phone.trim(),
      hasPlayed: false,
      createdAt: new Date().toISOString(),
    };

    players.push(newPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  },

  /**
   * Marks the player as played and records the prize won.
   * POST /api/players/complete-spin
   */
  async completeSpin(cin: string, prizeId: string, prizeName: string): Promise<void> {
    await delay(300);
    const players: Player[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const cleanCin = cin.trim();
    const playerIndex = players.findIndex(p => p.cin === cleanCin);

    if (playerIndex === -1) {
      throw new Error('Joueur non trouvé. Veuillez vous inscrire.');
    }

    if (players[playerIndex].hasPlayed) {
      throw new Error('Cette CIN a déjà participé. Une seule participation est autorisée.');
    }

    // Atomic updates to prevent simultaneous double-request exploit
    players[playerIndex].hasPlayed = true;
    players[playerIndex].prizeId = prizeId;
    players[playerIndex].prizeName = prizeName;
    players[playerIndex].playedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  },

  /**
   * Fetches all registered players.
   * GET /api/players
   */
  async getAllPlayers(): Promise<Player[]> {
    await delay(300);
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },

  /**
   * Updates player details (only Nom, Prénom, CIN, Téléphone are modifiable).
   * PUT /api/players/:id
   */
  async updatePlayer(id: string, data: { firstName: string; lastName: string; cin: string; phone: string }): Promise<void> {
    await delay(300);
    const players: Player[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const playerIndex = players.findIndex(p => p.id === id);
    if (playerIndex === -1) {
      throw new Error('Participant non trouvé.');
    }

    const cleanCin = data.cin.trim();
    // Validate uniqueness of the modified CIN
    const isConflict = players.some(p => p.cin === cleanCin && p.id !== id);
    if (isConflict) {
      throw new Error('Cette CIN est déjà enregistrée pour un autre participant.');
    }

    // Apply updates (excluding result, status, date)
    players[playerIndex].firstName = data.firstName.trim();
    players[playerIndex].lastName = data.lastName.trim();
    players[playerIndex].cin = cleanCin;
    players[playerIndex].phone = data.phone.trim();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  },

  /**
   * Deletes a player from the registry.
   * DELETE /api/players/:id
   */
  async deletePlayer(id: string): Promise<void> {
    await delay(300);
    const players: Player[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = players.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
