export interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'connecting';
  battery: number;
  signalStrength: 'excellent' | 'good' | 'poor' | 'none';
  cameraEnabled: boolean;
  cryDetection: boolean;
  lastActive: string;
  firmware: string;
  location: string;
  playbackDelay: number;
  fallbackMode: string;
  lightingMode: string;
  lightingBrightness: number;
}
