// ─────────────────────────────────────────────────────────────────────────────
// ADMIN CONFIG — Délice brand palette
// Red (Danup) · Blue (Glacière) · Green (Chasselane)
// ─────────────────────────────────────────────────────────────────────────────

export interface SegmentConfig {
  id: string;
  name: string;
  color: string;
  colorLight: string;
  icon: string;
  probability: number;
  tagline: string;
  emoji: string;
  image?: string;
  imageScale?: number;
  imageOffsetY?: number;
  imageRotationOffset?: number;
}

export interface WheelConfig {
  logoText: string;
  logoSubtext: string;
  logoImage: string;
  spinDuration: number;
  minExtraRotations: number;
  segments: SegmentConfig[];
}

const wheelConfig: WheelConfig = {
  logoText: 'délice',
  logoSubtext: 'PRODUITS LAITIERS',
  logoImage: '/delice-logo-center.png',
  spinDuration: 4500,
  minExtraRotations: 5,

  segments: [
    {
      id: 'danup',
      name: 'Danup',
      color: '#C62828',
      colorLight: '#EF5350',
      icon: 'Cup',
      probability: 1,
      tagline: 'Saveur yaourt irrésistible',
      emoji: '🥛',
      image: '/danup.png',
      imageScale: 1.35,
      imageOffsetY: 0,
      imageRotationOffset: 0,
    },
    {
      id: 'glaciere',
      name: 'Glacière',
      color: '#0057B8',
      colorLight: '#42A5F5',
      icon: 'IceCream',
      probability: 1,
      tagline: 'La fraîcheur qui fait du bien',
      emoji: '🍦',
      image: '/glaciere.png',
      imageScale: 1.0,
      imageOffsetY: 0,
      imageRotationOffset: 0,
    },
    {
      id: 'chasselane',
      name: 'Chasselane',
      color: '#2E7D32',
      colorLight: '#66BB6A',
      icon: 'Milk',
      probability: 1,
      tagline: 'Le goût du fromage authentique',
      emoji: '🧀',
      image: '/chasselane.png',
      imageScale: 1.0,
      imageOffsetY: 0,
      imageRotationOffset: 0,
    },
  ],
};

export default wheelConfig;
