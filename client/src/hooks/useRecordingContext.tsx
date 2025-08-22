import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface RecordingContextType {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

const RecordingContext = createContext<RecordingContextType | undefined>(undefined);

interface RecordingProviderProps {
  children: ReactNode;
}

export function RecordingProvider({ children }: RecordingProviderProps) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <RecordingContext.Provider
      value={{
        isRecording,
        setIsRecording,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
}

export function useRecordingContext() {
  const context = useContext(RecordingContext);
  if (context === undefined) {
    throw new Error('useRecordingContext must be used within a RecordingProvider');
  }
  return context;
}
