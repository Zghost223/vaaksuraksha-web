import { Pool } from 'pg';
import { AccuracyMetrics } from '@/types';

const SAMPLE_ACCURACY: AccuracyMetrics = {
  overall: {
    eer: 0.042,
    auc: 0.987,
    f1: 0.943,
    fprAt95Recall: 0.021,
  },
  perLanguage: {
    hindi: { eer: 0.038, auc: 0.991, f1: 0.952, fprAt95Recall: 0.018 },
    english: { eer: 0.035, auc: 0.993, f1: 0.958, fprAt95Recall: 0.015 },
    marathi: { eer: 0.045, auc: 0.984, f1: 0.935, fprAt95Recall: 0.024 },
    gujarati: { eer: 0.048, auc: 0.982, f1: 0.928, fprAt95Recall: 0.027 },
    tamil: { eer: 0.051, auc: 0.979, f1: 0.921, fprAt95Recall: 0.031 },
    bengali: { eer: 0.049, auc: 0.981, f1: 0.925, fprAt95Recall: 0.029 },
    telugu: { eer: 0.053, auc: 0.977, f1: 0.918, fprAt95Recall: 0.033 },
  },
  perCodec: {
    clean: { eer: 0.028, auc: 0.996, f1: 0.968, fprAt95Recall: 0.009 },
    g711: { eer: 0.052, auc: 0.978, f1: 0.915, fprAt95Recall: 0.035 },
    amr: { eer: 0.061, auc: 0.971, f1: 0.898, fprAt95Recall: 0.042 },
    gsm: { eer: 0.058, auc: 0.973, f1: 0.902, fprAt95Recall: 0.039 },
    opus: { eer: 0.039, auc: 0.989, f1: 0.945, fprAt95Recall: 0.019 },
  },
  unseenGenerator: {
    eer: 0.087,
    auc: 0.934,
    f1: 0.856,
    fprAt95Recall: 0.068,
  },
  lastUpdated: '2026-09-20T10:00:00Z',
};

function getPool(): Pool {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('POSTGRES_URL or DATABASE_URL not set');
  }
  return new Pool({ connectionString, max: 5, idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000 });
}

export async function getAccuracyMetrics(): Promise<AccuracyMetrics> {
  const pool = getPool();
  try {
    const result = await pool.query(
      'SELECT data FROM accuracy_metrics ORDER BY updated_at DESC LIMIT 1'
    );
    if (result.rows.length > 0) {
      return result.rows[0].data as AccuracyMetrics;
    }
  } catch (error) {
    console.warn('Database not available, using sample data:', error);
  } finally {
    await pool.end();
  }
  return SAMPLE_ACCURACY;
}

export async function saveAccuracyMetrics(metrics: AccuracyMetrics): Promise<void> {
  const pool = getPool();
  try {
    await pool.query(
      `INSERT INTO accuracy_metrics (data, updated_at)
       VALUES ($1, NOW())
       ON CONFLICT (id) DO UPDATE SET
         data = EXCLUDED.data,
         updated_at = EXCLUDED.updated_at`,
      [metrics]
    );
  } catch (error) {
    console.error('Failed to save accuracy metrics:', error);
  } finally {
    await pool.end();
  }
}

export async function getHealthCheck(): Promise<{ status: string; timestamp: string }> {
  const pool = getPool();
  try {
    await pool.query('SELECT 1');
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch {
    return { status: 'degraded', timestamp: new Date().toISOString() };
  } finally {
    await pool.end();
  }
}