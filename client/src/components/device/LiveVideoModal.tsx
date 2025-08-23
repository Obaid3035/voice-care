import { Camera, Play, RefreshCw, Square, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LiveVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceName: string;
}

interface CameraFrame {
  frame: string;
  timestamp: string;
}

export function LiveVideoModal({ isOpen, onClose, deviceName }: LiveVideoModalProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [lastFrameTime, setLastFrameTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [frameCount, setFrameCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('disconnected');

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const frameCountRef = useRef(0);

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    setError(null);

    try {
      wsRef.current = new WebSocket('ws://localhost:3000/ws/camera');

      wsRef.current.onopen = () => {
        console.log('✅ Connected to camera WebSocket');
        setIsConnected(true);
        setConnectionStatus('connected');
        setError(null);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          switch (message.type) {
            case 'status':
              console.log('📊 Camera status:', message.data);
              break;

            case 'frame':
              handleFrame(message.data);
              break;

            case 'pong':
              console.log('🏓 Received pong');
              break;

            default:
              console.log('📨 Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('❌ Camera WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setIsStreaming(false);
        setConnectionStatus('disconnected');

        // Attempt to reconnect after 3 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          if (connectionStatus !== 'connected') {
            connect();
          }
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ Camera WebSocket error:', error);
        setError('Failed to connect to camera stream');
        setConnectionStatus('disconnected');
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setError('Failed to create WebSocket connection');
      setConnectionStatus('disconnected');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsStreaming(false);
    setConnectionStatus('disconnected');
    setCurrentFrame(null);
    setLastFrameTime(null);
    setFrameCount(0);
    frameCountRef.current = 0;
  };

  const handleFrame = (data: CameraFrame) => {
    setCurrentFrame(data.frame);
    setLastFrameTime(new Date(data.timestamp));
    setIsStreaming(true);

    frameCountRef.current += 1;
    setFrameCount(frameCountRef.current);
  };

  const ping = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'ping' }));
    }
  };

  // Connect when modal opens
  useEffect(() => {
    if (isOpen) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isOpen]);

  // Ping every 30 seconds to keep connection alive
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (isConnected) {
        ping();
      }
    }, 30000);

    return () => clearInterval(pingInterval);
  }, [isConnected]);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connecting':
        return <Wifi className='h-4 w-4 animate-pulse' />;
      case 'connected':
        return <Wifi className='h-4 w-4 text-green-500' />;
      case 'disconnected':
        return <WifiOff className='h-4 w-4 text-red-500' />;
    }
  };

  const getStreamingIcon = () => {
    return isStreaming ? (
      <Play className='h-4 w-4 text-green-500' />
    ) : (
      <Square className='h-4 w-4 text-gray-400' />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-4xl bg-[rgb(var(--background))] border-[rgb(var(--border))]'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <DialogTitle className='text-[rgb(var(--text-primary))] text-xl'>
              Live Video - {deviceName}
            </DialogTitle>
            <div className='flex items-center space-x-2'>
              <Badge variant={isConnected ? 'default' : 'secondary'}>
                {getConnectionIcon()}
                <span className='ml-1'>
                  {connectionStatus === 'connecting'
                    ? 'Connecting...'
                    : connectionStatus === 'connected'
                      ? 'Connected'
                      : 'Disconnected'}
                </span>
              </Badge>
              <Badge variant={isStreaming ? 'default' : 'secondary'}>
                {getStreamingIcon()}
                <span className='ml-1'>{isStreaming ? 'Streaming' : 'Idle'}</span>
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-4'>
          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Camera Feed */}
          <div className='relative bg-black rounded-lg overflow-hidden aspect-video'>
            {currentFrame ? (
              <img
                src={`data:image/jpeg;base64,${currentFrame}`}
                alt='Live camera feed'
                className='w-full h-full object-contain'
                onError={(e) => {
                  console.error('Error loading image:', e);
                  setError('Failed to load camera frame');
                }}
              />
            ) : (
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='text-center text-white'>
                  <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center'>
                    <Camera className='w-8 h-8' />
                  </div>
                  <p className='text-lg font-medium'>Live Stream</p>
                  <p className='text-sm text-gray-300 mt-1'>
                    {!isConnected ? 'Connecting to camera...' : 'Waiting for video feed...'}
                  </p>
                  {!isConnected && (
                    <Button onClick={connect} className='mt-4' variant='outline' size='sm'>
                      <RefreshCw className='h-4 w-4 mr-2' />
                      Reconnect
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Live Indicator */}
            <div className='absolute top-4 left-4'>
              <div className='flex items-center gap-2 px-3 py-1 bg-green-500/90 text-white rounded-full text-sm'>
                <div className='w-2 h-2 bg-white rounded-full animate-pulse' />
                Live
              </div>
            </div>

            {/* Frame Info Overlay */}
            {currentFrame && (
              <div className='absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm'>
                Frame: {frameCount}
                {lastFrameTime && (
                  <div className='text-xs opacity-75'>{lastFrameTime.toLocaleTimeString()}</div>
                )}
              </div>
            )}
          </div>

          {/* Device Info */}
          <div className='flex items-center justify-between p-4 bg-[rgb(var(--background-secondary))] rounded-lg'>
            <div>
              <h3 className='font-medium text-[rgb(var(--text-primary))]'>{deviceName}</h3>
              <p className='text-sm text-[rgb(var(--text-secondary))]'>
                Live video stream from ESP32 camera
              </p>
            </div>
            <div className='flex items-center gap-4 text-sm text-[rgb(var(--text-secondary))]'>
              <div className='flex items-center gap-1'>
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                />
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 bg-blue-500 rounded-full' />
                HD
              </div>
              {lastFrameTime && (
                <div className='text-xs'>Last frame: {lastFrameTime.toLocaleTimeString()}</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
