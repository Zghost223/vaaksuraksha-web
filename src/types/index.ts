export interface AccuracyMetrics {
  overall: {
    eer: number;
    auc: number;
    f1: number;
    fprAt95Recall: number;
  };
  perLanguage: Record<string, {
    eer: number;
    auc: number;
    f1: number;
    fprAt95Recall: number;
  }>;
  perCodec: Record<string, {
    eer: number;
    auc: number;
    f1: number;
    fprAt95Recall: number;
  }>;
  unseenGenerator: {
    eer: number;
    auc: number;
    f1: number;
    fprAt95Recall: number;
  };
  lastUpdated: string;
}

export interface RiskScore {
  sessionId: string;
  timestamp: string;
  layer1: number;
  layer2: number;
  layer3: number;
  layer4: number | null;
  context: number;
  fusedScore: number;
  smoothedScore: number;
  status: 'green' | 'amber' | 'red';
}

export interface Session {
  id: string;
  policyId: string;
  scenario: string;
  startTime: string;
  endTime: string | null;
  status: 'active' | 'completed' | 'stopped';
}

export interface Policy {
  id: string;
  name: string;
  scenario: 'general_call' | 'high_value_transaction' | 'privileged_access';
  thresholds: {
    amber: number;
    red: number;
  };
  onAmber: string[];
  onRed: string[];
  context: Record<string, unknown>;
}

export interface LedgerEntry {
  id: string;
  sessionId: string;
  timestamp: string;
  reportHash: string;
  previousHash: string;
  chainHash: string;
  data: Record<string, unknown>;
}