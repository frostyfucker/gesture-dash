export interface TourStep {
  id: number;
  title: string;
  target: string;
  description: string;
  badge: string;
}

export interface CouncilNode {
  id: string;
  name: string;
  title: string;
  role: string;
  activity: string;
  health: 'Stable' | 'Critical' | 'Warning';
  metrics: {
    lat: string;
    items: number;
    completion: number;
  };
  angle: number; // orbital angle in degrees
  yOffset: number; // depth offset
}

export interface GestureInfo {
  name: string;
  symbol: string;
  description: string;
}

export interface PhonemeBlock {
  id: string;
  symbol: string;
  ipa: string;
  duration: number; // ms
  pitch: number; // Hz
}
