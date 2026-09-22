'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { RiskMeter } from '@/components/RiskMeter';
import { LayerBars } from '@/components/LayerBars';
import { RiskScore } from '@/types';

const POLICIES = {
  general_call: { amber: 0.50, red: 0.80, name: 'General Call', on_amber_actions: ['show_banner'], on_red_actions: ['warning', 'suggest_callback'] },
  high_value_transaction: { amber: 0.35, red: 0.65, name: 'High-Value Transaction', on_amber_actions: ['show_banner', 'run_challenge'], on_red_actions: ['hold_transaction', 'require_callback', 'require_mfa', 'notify_supervisor', 'log_incident'] },
  privileged_access: { amber: 0.30, red: 0.60, name: 'Privileged Access', on_amber_actions: ['show_banner', 'run_challenge', 'require_second_approver'], on_red_actions: ['block', 'open_incident', 'log_to_ledger'] },
};

type PolicyKey = keyof typeof POLICIES;

export function DashboardPageClient() {
  const { t } = useLanguage();
  
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [policy, setPolicy] = useState<PolicyKey>('general_call');
  const [riskScore, setRiskScore] = useState<RiskScore>({
    sessionId: '',
    timestamp: new Date().toISOString(),
    layer1: 0.12,
    layer2: 0.08,
    layer3: 0.05,
    layer4: null,
    context: 0.10,
    fusedScore: 0.09,
    smoothedScore: 0.08,
    status: 'green',
  });
  const [history, setHistory] = useState<RiskScore[]>([]);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengePhrase, setChallengePhrase] = useState('');

  const CHALLENGE_PHRASES = [
    'The quick brown fox jumps over the lazy dog',
    'Please verify your identity by saying your full name',
    'Read this number: 7 3 9 1 4 6 2 8',
    'Say the word "security" three times',
    'Repeat: "Voice integrity verification required"',
  ];

  const generateMockScores = useCallback((isAttack: boolean): Omit<RiskScore, 'sessionId' | 'timestamp'> => {
    if (isAttack) {
      const base = 0.6 + Math.random() * 0.3;
      return {
        layer1: Math.min(0.95, base + (Math.random() - 0.5) * 0.2),
        layer2: Math.min(0.95, base + (Math.random() - 0.5) * 0.2),
        layer3: Math.min(0.95, base + (Math.random() - 0.5) * 0.2),
        layer4: Math.min(0.95, base + (Math.random() - 0.5) * 0.2),
        context: Math.min(0.9, 0.3 + Math.random() * 0.4),
        fusedScore: 0,
        smoothedScore: 0,
        status: 'red',
      };
    }
    return {
      layer1: Math.max(0, 0.12 + (Math.random() - 0.5) * 0.08),
      layer2: Math.max(0, 0.08 + (Math.random() - 0.5) * 0.06),
      layer3: Math.max(0, 0.05 + (Math.random() - 0.5) * 0.04),
      layer4: null,
      context: Math.max(0, 0.10 + (Math.random() - 0.5) * 0.05),
      fusedScore: 0,
      smoothedScore: 0,
      status: 'green',
    };
  }, []);

  const computeFused = useCallback((scores: Omit<RiskScore, 'sessionId' | 'timestamp' | 'fusedScore' | 'smoothedScore' | 'status'>) => {
    const weights = { layer1: 0.35, layer2: 0.25, layer3: 0.25, layer4: 0.1, context: 0.05 };
    let fused = 0;
    fused += scores.layer1 * weights.layer1;
    fused += scores.layer2 * weights.layer2;
    fused += scores.layer3 * weights.layer3;
    if (scores.layer4 !== null) fused += scores.layer4 * weights.layer4;
    fused += scores.context * weights.context;
    
    const policyThresholds = POLICIES[policy];
    let status: 'green' | 'amber' | 'red' = 'green';
    if (fused >= policyThresholds.red) status = 'red';
    else if (fused >= policyThresholds.amber) status = 'amber';
    
    return { fusedScore: fused, status };
  }, [policy]);

  useEffect(() => {
    if (!isActive) return;

    let prevSmoothed = riskScore.smoothedScore;
    const interval = setInterval(() => {
      const isAttackSimulation = Math.random() < 0.15; // 15% chance of attack pattern
      const newScores = generateMockScores(isAttackSimulation);
      const { fusedScore, status } = computeFused(newScores);
      
      const alpha = 0.3;
      const smoothedScore = alpha * fusedScore + (1 - alpha) * prevSmoothed;
      prevSmoothed = smoothedScore;

      const newRiskScore: RiskScore = {
        ...newScores,
        fusedScore,
        smoothedScore,
        status,
        sessionId,
        timestamp: new Date().toISOString(),
      };

      setRiskScore(newRiskScore);
      setHistory(prev => [...prev.slice(-49), newRiskScore]);

      // Trigger challenge at AMBER
      if (status === 'amber' && !showChallenge && newScores.layer4 === null) {
        setChallengePhrase(CHALLENGE_PHRASES[Math.floor(Math.random() * CHALLENGE_PHRASES.length)]);
        setShowChallenge(true);
      }

      // If challenge was shown, simulate L4 response
      if (showChallenge && newScores.layer4 === null && Math.random() < 0.3) {
        // Simulate challenge response analysis
        setTimeout(() => {
          setRiskScore(prev => ({
            ...prev,
            layer4: isAttackSimulation ? 0.7 + Math.random() * 0.2 : 0.1 + Math.random() * 0.15,
          }));
          setShowChallenge(false);
        }, 2000);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isActive, sessionId, policy, riskScore.smoothedScore, showChallenge, generateMockScores, computeFused]);

  const startSession = () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    setIsActive(true);
    setHistory([]);
    setShowChallenge(false);
  };

  const stopSession = () => {
    setIsActive(false);
  };

  const triggerChallenge = () => {
    setChallengePhrase(CHALLENGE_PHRASES[Math.floor(Math.random() * CHALLENGE_PHRASES.length)]);
    setShowChallenge(true);
  };

  const layers = [
    { label: t.dashboard.labels.layer1, score: riskScore.layer1, color: 'primary' as const },
    { label: t.dashboard.labels.layer2, score: riskScore.layer2, color: 'success' as const },
    { label: t.dashboard.labels.layer3, score: riskScore.layer3, color: 'warning' as const },
    { label: t.dashboard.labels.layer4, score: riskScore.layer4 ?? 0, color: 'danger' as const },
    { label: t.dashboard.labels.context, score: riskScore.context, color: 'primary' as const },
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboard.title}</h1>
            <p className="text-gray-600">Real-time voice integrity monitoring with multi-layer analysis</p>
          </header>

          {/* Session Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">{t.dashboard.labels.riskScore}:</label>
                <select
                  value={policy}
                  onChange={(e) => setPolicy(e.target.value as PolicyKey)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="general_call">{POLICIES.general_call.name} (Amber: 0.50, Red: 0.80)</option>
                  <option value="high_value_transaction">{POLICIES.high_value_transaction.name} (Amber: 0.35, Red: 0.65)</option>
                  <option value="privileged_access">{POLICIES.privileged_access.name} (Amber: 0.30, Red: 0.60)</option>
                </select>
              </div>

              <div className="flex gap-3">
                {isActive ? (
                  <>
                    <button
                      onClick={triggerChallenge}
                      className="px-4 py-2 bg-warning-500 text-white rounded-lg font-medium hover:bg-warning-600 transition-colors"
                    >
                      {t.dashboard.actions.triggerChallenge}
                    </button>
                    <button
                      onClick={stopSession}
                      className="px-4 py-2 bg-danger-500 text-white rounded-lg font-medium hover:bg-danger-600 transition-colors"
                    >
                      {t.dashboard.actions.stopSession}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={startSession}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    {t.dashboard.actions.startSession}
                  </button>
                )}
              </div>
            </div>

            {sessionId && (
              <p className="mt-4 text-sm text-gray-500 font-mono">Session: {sessionId}</p>
            )}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Meter - Large */}
            <div className="lg:col-span-1">
              <RiskMeter score={riskScore.smoothedScore} status={riskScore.status} label={t.dashboard.labels.smoothedScore} />
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">{t.dashboard.labels.fusedScore}</h3>
                <div className="text-3xl font-bold font-mono text-gray-900">{(riskScore.fusedScore * 100).toFixed(1)}%</div>
              </div>

              {/* Threshold indicators */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{POLICIES[policy].name} Thresholds</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full relative">
                  <div className="absolute top-0 bottom-0 bg-success-500 rounded-full" style={{ width: `${POLICIES[policy].amber * 100}%` }}></div>
                  <div className="absolute top-0 bottom-0 bg-warning-500 rounded-full" style={{ left: `${POLICIES[policy].amber * 100}%`, width: `${(POLICIES[policy].red - POLICIES[policy].amber) * 100}%` }}></div>
                  <div className="absolute top-0 bottom-0 bg-danger-500 rounded-full" style={{ left: `${POLICIES[policy].red * 100}%`, width: `${(1 - POLICIES[policy].red) * 100}%` }}></div>
                  <div className="absolute top-full left-0 mt-1 text-xs text-gray-500">0%</div>
                  <div className="absolute top-full right-0 mt-1 text-xs text-gray-500">100%</div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Green</span>
                  <span>Amber ≥ {POLICIES[policy].amber}</span>
                  <span>Red ≥ {POLICIES[policy].red}</span>
                </div>
              </div>
            </div>

            {/* Layer Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              <article className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Layer Contributions</h2>
                <LayerBars layers={layers} />
              </article>

              {/* Active Challenge */}
              {showChallenge && (
                <article className="bg-warning-50 border border-warning-200 rounded-xl p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-warning-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-warning-800 mb-1">Active Challenge Triggered</h3>
                      <p className="text-warning-700 mb-3">Please ask the caller to repeat the following phrase:</p>
                      <div className="bg-white border border-warning-300 rounded-lg p-4 font-mono text-gray-900">
                        "{challengePhrase}"
                      </div>
                      <p className="text-sm text-warning-600 mt-2">Analyzing response for real-time synthesis artifacts...</p>
                    </div>
                  </div>
                </article>
              )}

              {/* History Chart */}
              {history.length > 0 && (
                <article className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Score Timeline</h2>
                  <div className="h-64 relative">
                    <svg className="w-full h-full" viewBox="0 0 800 256" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                        </linearGradient>
                        <linearGradient id="amberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                        </linearGradient>
                        <linearGradient id="redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      
                      {/* Threshold lines */}
                      <line x1="0" y1="256 - 256 * 0.35" x2="800" y2="256 - 256 * 0.35" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>
                      <line x1="0" y1="256 - 256 * 0.65" x2="800" y2="256 - 256 * 0.65" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>
                      
                      {/* Green zone */}
                      <rect x="0" y="256 - 256 * 0.35" width="800" height="256 * 0.35" fill="url(#greenGrad)"/>
                      {/* Amber zone */}
                      <rect x="0" y="256 - 256 * 0.65" width="800" height="256 * 0.30" fill="url(#amberGrad)"/>
                      {/* Red zone */}
                      <rect x="0" y="0" width="800" height="256 - 256 * 0.65" fill="url(#redGrad)"/>

                      {/* Line path */}
                      {history.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#0ea5e9"
                          strokeWidth="2"
                          points={history.map((h, i) => `${(i / Math.max(1, history.length - 1)) * 800},${256 - h.smoothedScore * 256}`).join(' ')}
                        />
                      )}
                      
                      {/* Current point */}
                      {history.length > 0 && (
                        <circle
                          cx={800}
                          cy={256 - riskScore.smoothedScore * 256}
                          r={6}
                          fill="#0ea5e9"
                          stroke="white"
                          strokeWidth="2"
                        />
                      )}
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
                      <span>Start</span>
                      <span>Now</span>
                    </div>
                  </div>
                </article>
              )}
            </div>
          </div>

          {/* Actions based on status */}
          {(riskScore.status === 'amber' || riskScore.status === 'red') && (
            <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {riskScore.status === 'red' ? '🔴 RED - High Risk Actions' : '🟡 AMBER - Suspicious Activity'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {POLICIES[policy].on_amber_actions.map((action, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{action.replace(/_/g, ' ')}</span>
                  </div>
                ))}
                {riskScore.status === 'red' && POLICIES[policy].on_red_actions.map((action, i) => (
                  <div key={i} className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                    <span className="text-sm font-medium text-danger-700">{action.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}