import React, { createContext, useContext, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import reportsRegistryMachine from './registryMachine';

type RegistryContextType = {
  state: any;
  send: (event: { type: string; [key: string]: unknown }) => void;
};

const RegistryContext = createContext<RegistryContextType | null>(null);

export const ReportsRegistryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, send] = useMachine(reportsRegistryMachine);
  return (
    <RegistryContext.Provider value={{ state, send }}>
      {children}
    </RegistryContext.Provider>
  );
};

export const useReportsRegistryContext = () => {
  const ctx = useContext(RegistryContext);
  if (!ctx) throw new Error('useReportsRegistryContext must be used within ReportsRegistryProvider');
  return ctx;
};
