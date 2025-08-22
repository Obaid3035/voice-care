import { FileText, Music } from 'lucide-react';
import type { Device } from '@/components/device/types';

// ===== DEVICE DATA =====
export const mockDevices: Device[] = [
  {
    id: '1',
    name: "Emma's Room Device",
    status: 'online',
    battery: 85,
    signalStrength: 'excellent',
    cameraEnabled: true,
    cryDetection: true,
    lastActive: '2 minutes ago',
    firmware: 'v2.1.3',
    location: "Nursery - Emma's Room",
    playbackDelay: 5,
    fallbackMode: 'lullaby',
    lightingMode: 'auto',
    lightingBrightness: 30,
  },
  {
    id: '2',
    name: "Lucas' Room Device",
    status: 'online',
    battery: 62,
    signalStrength: 'good',
    cameraEnabled: false,
    cryDetection: true,
    lastActive: '1 hour ago',
    firmware: 'v2.1.2',
    location: "Bedroom - Lucas' Room",
    playbackDelay: 3,
    fallbackMode: 'story',
    lightingMode: 'night',
    lightingBrightness: 15,
  },
  {
    id: '3',
    name: 'Living Room Device',
    status: 'offline',
    battery: 15,
    signalStrength: 'poor',
    cameraEnabled: true,
    cryDetection: false,
    lastActive: '3 hours ago',
    firmware: 'v2.0.9',
    location: 'Living Room',
    playbackDelay: 10,
    fallbackMode: 'affirmation',
    lightingMode: 'off',
    lightingBrightness: 0,
  },
];



// ===== ACTIVITY DATA =====
export interface ActivityEvent {
  id: string;
  type: 'cry' | 'content' | 'device' | 'voice' | 'snapshot';
  timestamp: string;
  title: string;
  description: string;
  device?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'ongoing' | 'failed';
}

export const mockActivities: ActivityEvent[] = [
  {
    id: '1',
    type: 'cry',
    timestamp: '2 minutes ago',
    title: "Cry detected in Emma's Room",
    description: 'Played "Mommy\'s Lullaby #3" - Baby calmed in 30 seconds',
    device: "Emma's Room Device",
    priority: 'high',
    status: 'completed',
  },
  {
    id: '2',
    type: 'content',
    timestamp: '15 minutes ago',
    title: 'New content generated',
    description: 'Created "Bedtime Story: The Sleepy Forest" in your voice',
    priority: 'medium',
    status: 'completed',
  },
  {
    id: '3',
    type: 'snapshot',
    timestamp: '32 minutes ago',
    title: 'Automatic snapshot captured',
    description: 'Motion detected in Living Room - Photo saved to gallery',
    device: 'Living Room Device',
    priority: 'low',
    status: 'completed',
  },
  {
    id: '4',
    type: 'cry',
    timestamp: '1 hour ago',
    title: "Cry detected in Lucas' Room",
    description: 'Played "Daddy\'s Story Time #7" - No response, escalated to phone',
    device: "Lucas' Room Device",
    priority: 'high',
    status: 'failed',
  },
  {
    id: '5',
    type: 'device',
    timestamp: '2 hours ago',
    title: 'Device mode changed',
    description: 'Living Room Device switched to Night Mode automatically',
    device: 'Living Room Device',
    priority: 'low',
    status: 'completed',
  },
  {
    id: '6',
    type: 'voice',
    timestamp: '3 hours ago',
    title: 'Voice profile updated',
    description: 'Enhanced voice model with 5 new training samples',
    priority: 'medium',
    status: 'completed',
  },
];

// ===== METRICS DATA =====
export interface Metric {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  description: string;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export const mockMetrics: Metric[] = [
  {
    title: 'Total Content',
    value: 127,
    change: '+12 this week',
    trend: 'up',
    icon: Music,
    description: 'Generated audio content',
    color: 'default',
  },
  {
    title: 'Logs',
    value: 45,
    change: '+8 today',
    trend: 'up',
    icon: FileText,
    description: 'System activity logs',
    color: 'default',
  },
];

// ===== EVENT LOG DATA =====
export interface EventLog {
  id: string;
  device_id: string;
  content_id?: string;
  event_type:
    | 'cry_detected'
    | 'content_played'
    | 'device_online'
    | 'device_offline'
    | 'snapshot_taken'
    | 'voice_generated';
  intensity?: number; // 1-10 scale for cry events
  timestamp: string;
  device_name?: string;
  content_title?: string;
  description?: string;
}

export const mockEventLogs: EventLog[] = [
  {
    id: '1',
    device_id: 'device_001',
    event_type: 'cry_detected',
    intensity: 8,
    timestamp: '2024-01-15T14:30:00Z',
    device_name: "Emma's Room Device",
    description: 'Cry detected with high intensity, triggering lullaby playback',
  },
  {
    id: '2',
    device_id: 'device_001',
    content_id: 'content_001',
    event_type: 'content_played',
    timestamp: '2024-01-15T14:30:05Z',
    device_name: "Emma's Room Device",
    content_title: 'Gentle Ocean Lullaby',
    description: 'Lullaby started playing in response to cry detection',
  },
  {
    id: '3',
    device_id: 'device_002',
    event_type: 'cry_detected',
    intensity: 5,
    timestamp: '2024-01-15T14:25:00Z',
    device_name: "Lucas' Room Device",
    description: 'Cry detected with medium intensity',
  },
  {
    id: '4',
    device_id: 'device_002',
    content_id: 'content_002',
    event_type: 'content_played',
    timestamp: '2024-01-15T14:25:03Z',
    device_name: "Lucas' Room Device",
    content_title: 'The Sleepy Little Bear',
    description: 'Bedtime story started playing',
  },
  {
    id: '5',
    device_id: 'device_001',
    event_type: 'snapshot_taken',
    timestamp: '2024-01-15T14:20:00Z',
    device_name: "Emma's Room Device",
    description: 'Snapshot captured due to motion detection',
  },
  {
    id: '6',
    device_id: 'device_003',
    event_type: 'device_offline',
    timestamp: '2024-01-15T14:15:00Z',
    device_name: 'Living Room Device',
    description: 'Device went offline unexpectedly',
  },
  {
    id: '7',
    device_id: 'device_001',
    content_id: 'content_003',
    event_type: 'content_played',
    timestamp: '2024-01-15T14:10:00Z',
    device_name: "Emma's Room Device",
    content_title: 'You Are Loved',
    description: 'Affirmation played on schedule',
  },
  {
    id: '8',
    device_id: 'device_002',
    event_type: 'cry_detected',
    intensity: 3,
    timestamp: '2024-01-15T14:05:00Z',
    device_name: "Lucas' Room Device",
    description: 'Cry detected with low intensity, no action needed',
  },
  {
    id: '9',
    device_id: 'device_001',
    event_type: 'voice_generated',
    timestamp: '2024-01-15T14:00:00Z',
    device_name: "Emma's Room Device",
    description: 'New voice content generated successfully',
  },
  {
    id: '10',
    device_id: 'device_002',
    event_type: 'device_online',
    timestamp: '2024-01-15T13:55:00Z',
    device_name: "Lucas' Room Device",
    description: 'Device reconnected to network',
  },
  {
    id: '11',
    device_id: 'device_001',
    event_type: 'cry_detected',
    intensity: 9,
    timestamp: '2024-01-15T13:50:00Z',
    device_name: "Emma's Room Device",
    description: 'High intensity cry detected, emergency response triggered',
  },
  {
    id: '12',
    device_id: 'device_001',
    content_id: 'content_004',
    event_type: 'content_played',
    timestamp: '2024-01-15T13:50:02Z',
    device_name: "Emma's Room Device",
    content_title: 'Emergency Calming Sequence',
    description: 'Emergency calming content played immediately',
  },
  {
    id: '13',
    device_id: 'device_003',
    event_type: 'device_online',
    timestamp: '2024-01-15T13:45:00Z',
    device_name: 'Living Room Device',
    description: 'Device came back online',
  },
  {
    id: '14',
    device_id: 'device_002',
    event_type: 'snapshot_taken',
    timestamp: '2024-01-15T13:40:00Z',
    device_name: "Lucas' Room Device",
    description: 'Scheduled snapshot captured',
  },
  {
    id: '15',
    device_id: 'device_001',
    event_type: 'cry_detected',
    intensity: 6,
    timestamp: '2024-01-15T13:35:00Z',
    device_name: "Emma's Room Device",
    description: 'Cry detected, but settled quickly',
  },
];
