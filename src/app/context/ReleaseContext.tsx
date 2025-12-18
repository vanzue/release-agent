import { createContext, useContext, useState, ReactNode } from 'react';

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';
export type SessionStatus = 'draft' | 'generating' | 'ready' | 'exported';

export interface Job {
  id: string;
  type: 'parse-changes' | 'generate-notes' | 'analyze-hotspots' | 'generate-testplan';
  status: JobStatus;
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface Session {
  id: string;
  releaseId: string;
  name: string;
  status: SessionStatus;
  baseRef: string;
  headRef: string;
  createdAt: Date;
  updatedAt: Date;
  jobs: Job[];
  stats: {
    changeCount: number;
    releaseNotesCount: number;
    hotspotsCount: number;
    testCasesCount: number;
  };
}

export interface Release {
  id: string;
  name: string;
  repo: string;
  targetBranch: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  sessions: Session[];
  status: 'active' | 'archived';
}

interface ReleaseContextType {
  releases: Release[];
  currentRelease: Release | null;
  currentSession: Session | null;
  setCurrentRelease: (releaseId: string) => void;
  setCurrentSession: (sessionId: string) => void;
  createRelease: (data: Partial<Release>) => Release;
  createSession: (releaseId: string, data: Partial<Session>) => Session;
  updateJobStatus: (sessionId: string, jobId: string, status: JobStatus, progress: number) => void;
  getRunningJobs: () => { release: Release; session: Session; job: Job }[];
}

const ReleaseContext = createContext<ReleaseContextType | undefined>(undefined);

// Mock data
const mockReleases: Release[] = [
  {
    id: 'rel-1',
    name: '0.97.x Release',
    repo: 'microsoft/PowerToys',
    targetBranch: 'release/0.97',
    version: '0.97.0',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-18'),
    status: 'active',
    sessions: [
      {
        id: 'sess-1',
        releaseId: 'rel-1',
        name: 'Initial generation',
        status: 'ready',
        baseRef: 'v0.96.0',
        headRef: 'release/0.97',
        createdAt: new Date('2024-12-18T10:00:00'),
        updatedAt: new Date('2024-12-18T10:15:00'),
        jobs: [
          { id: 'job-1', type: 'parse-changes', status: 'completed', progress: 100 },
          { id: 'job-2', type: 'generate-notes', status: 'completed', progress: 100 },
          { id: 'job-3', type: 'analyze-hotspots', status: 'completed', progress: 100 },
          { id: 'job-4', type: 'generate-testplan', status: 'completed', progress: 100 },
        ],
        stats: { changeCount: 128, releaseNotesCount: 45, hotspotsCount: 8, testCasesCount: 32 },
      },
      {
        id: 'sess-2',
        releaseId: 'rel-1',
        name: 'Updated after PRs merged',
        status: 'generating',
        baseRef: 'v0.96.0',
        headRef: 'release/0.97',
        createdAt: new Date('2024-12-18T14:00:00'),
        updatedAt: new Date('2024-12-18T14:05:00'),
        jobs: [
          { id: 'job-5', type: 'parse-changes', status: 'completed', progress: 100 },
          { id: 'job-6', type: 'generate-notes', status: 'running', progress: 65 },
          { id: 'job-7', type: 'analyze-hotspots', status: 'pending', progress: 0 },
          { id: 'job-8', type: 'generate-testplan', status: 'pending', progress: 0 },
        ],
        stats: { changeCount: 135, releaseNotesCount: 0, hotspotsCount: 0, testCasesCount: 0 },
      },
    ],
  },
  {
    id: 'rel-2',
    name: '0.98.x Release',
    repo: 'microsoft/PowerToys',
    targetBranch: 'release/0.98',
    version: '0.98.0',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
    status: 'active',
    sessions: [],
  },
];

export function ReleaseProvider({ children }: { children: ReactNode }) {
  const [releases, setReleases] = useState<Release[]>(mockReleases);
  const [currentReleaseId, setCurrentReleaseId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const currentRelease = releases.find((r) => r.id === currentReleaseId) || null;
  const currentSession = currentRelease?.sessions.find((s) => s.id === currentSessionId) || null;

  const setCurrentRelease = (releaseId: string) => {
    setCurrentReleaseId(releaseId);
    setCurrentSessionId(null);
  };

  const setCurrentSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const createRelease = (data: Partial<Release>): Release => {
    const newRelease: Release = {
      id: `rel-${Date.now()}`,
      name: data.name || 'New Release',
      repo: data.repo || 'microsoft/PowerToys',
      targetBranch: data.targetBranch || 'main',
      version: data.version || '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      sessions: [],
      status: 'active',
    };
    setReleases((prev) => [...prev, newRelease]);
    return newRelease;
  };

  const createSession = (releaseId: string, data: Partial<Session>): Session => {
    const newSession: Session = {
      id: `sess-${Date.now()}`,
      releaseId,
      name: data.name || 'New Session',
      status: 'generating',
      baseRef: data.baseRef || '',
      headRef: data.headRef || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      jobs: [
        { id: `job-${Date.now()}-1`, type: 'parse-changes', status: 'running', progress: 0 },
        { id: `job-${Date.now()}-2`, type: 'generate-notes', status: 'pending', progress: 0 },
        { id: `job-${Date.now()}-3`, type: 'analyze-hotspots', status: 'pending', progress: 0 },
        { id: `job-${Date.now()}-4`, type: 'generate-testplan', status: 'pending', progress: 0 },
      ],
      stats: { changeCount: 0, releaseNotesCount: 0, hotspotsCount: 0, testCasesCount: 0 },
    };

    setReleases((prev) =>
      prev.map((r) =>
        r.id === releaseId
          ? { ...r, sessions: [...r.sessions, newSession], updatedAt: new Date() }
          : r
      )
    );

    return newSession;
  };

  const updateJobStatus = (sessionId: string, jobId: string, status: JobStatus, progress: number) => {
    setReleases((prev) =>
      prev.map((release) => ({
        ...release,
        sessions: release.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                jobs: session.jobs.map((job) =>
                  job.id === jobId ? { ...job, status, progress } : job
                ),
                updatedAt: new Date(),
              }
            : session
        ),
      }))
    );
  };

  const getRunningJobs = () => {
    const running: { release: Release; session: Session; job: Job }[] = [];
    releases.forEach((release) => {
      release.sessions.forEach((session) => {
        session.jobs.forEach((job) => {
          if (job.status === 'running') {
            running.push({ release, session, job });
          }
        });
      });
    });
    return running;
  };

  return (
    <ReleaseContext.Provider
      value={{
        releases,
        currentRelease,
        currentSession,
        setCurrentRelease,
        setCurrentSession,
        createRelease,
        createSession,
        updateJobStatus,
        getRunningJobs,
      }}
    >
      {children}
    </ReleaseContext.Provider>
  );
}

export function useRelease() {
  const context = useContext(ReleaseContext);
  if (!context) {
    throw new Error('useRelease must be used within ReleaseProvider');
  }
  return context;
}
