import { createContext, useContext, useState, ReactNode } from 'react';

export type DraftStatus = 'Draft' | 'Generating' | 'Ready' | 'Exported';

interface DraftState {
  repo: string;
  targetBranch: string;
  baseRef: string;
  headRef: string;
  status: DraftStatus;
  title: string;
  changeCount: number;
  releaseNotesCount: number;
}

interface DraftContextType {
  draft: DraftState;
  updateDraft: (updates: Partial<DraftState>) => void;
  generateDraft: (data: any) => void;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<DraftState>({
    repo: 'microsoft/PowerToys',
    targetBranch: 'release/0.97',
    baseRef: 'v0.97.0',
    headRef: 'release/0.97@HEAD',
    status: 'Draft',
    title: 'Draft: 0.97.x Release',
    changeCount: 128,
    releaseNotesCount: 45,
  });

  const updateDraft = (updates: Partial<DraftState>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const generateDraft = (data: any) => {
    setDraft((prev) => ({
      ...prev,
      ...data,
      status: 'Generating' as DraftStatus,
    }));
    
    // Simulate generation
    setTimeout(() => {
      setDraft((prev) => ({ ...prev, status: 'Ready' as DraftStatus }));
    }, 2000);
  };

  return (
    <DraftContext.Provider value={{ draft, updateDraft, generateDraft }}>
      {children}
    </DraftContext.Provider>
  );
}

export function useDraft() {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error('useDraft must be used within DraftProvider');
  }
  return context;
}
