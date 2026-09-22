'use client';

import { useLanguage } from '@/components/LanguageProvider';

export function AboutPageClient() {
  const { t } = useLanguage();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.about.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{t.about.description}</p>
          </header>

          <article className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t.about.problemStatement}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                Voice-cloning models now need only seconds to minutes of audio to imitate a person. Attackers use these
                voices to impersonate executives, officials and relatives and pressure staff into approving transfers or sharing
                confidential data. Caller ID, call-backs and "it sounds like him" no longer work, and research shows people
                struggle to tell cloned voices from real ones.
              </p>
              <p className="text-gray-600 mb-4">
                Existing enterprise controls protect the network, identity and endpoints, but the live voice channel remains
                largely unprotected. PS 26104 asks for a real-time, privacy-preserving, scalable, multilingual framework with
                a risk score, alerts, and integration APIs.
              </p>
              <p className="text-gray-600 mb-4">
                <strong className="text-gray-900">{t.about.organization}</strong>
              </p>
            </div>
          </article>

          <article className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Solution Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-primary-50 rounded-lg">
                <h3 className="font-medium text-primary-800 mb-2">DETECT</h3>
                <p className="text-sm text-primary-700">4-layer analysis: spectral/SSL artifacts, prosody patterns, speaker drift, active challenge-response</p>
              </div>
              <div className="p-4 bg-success-50 rounded-lg">
                <h3 className="font-medium text-success-800 mb-2">DECIDE</h3>
                <p className="text-sm text-success-700">Fused risk score with EMA smoothing, contextual enrichment, per-scenario configurable thresholds</p>
              </div>
              <div className="p-4 bg-warning-50 rounded-lg">
                <h3 className="font-medium text-warning-800 mb-2">PREVENT</h3>
                <p className="text-sm text-warning-700">Pre-transaction warnings, step-up verification (call-back + MFA), automated workflow holds</p>
              </div>
              <div className="p-4 bg-danger-50 rounded-lg">
                <h3 className="font-medium text-danger-800 mb-2">PROTECT</h3>
                <p className="text-sm text-danger-700">Edge inference, RAM-only audio buffers, feature-only logs, tamper-evident hash-chained audit ledger</p>
              </div>
            </div>
          </article>

          <article className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t.about.stack}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">ML & Audio</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>PyTorch, torchaudio, Hugging Face Transformers</li>
                  <li>SpeechBrain (ECAPA-TDNN)</li>
                  <li>AASIST reference implementation</li>
                  <li>librosa, Praat-Parselmouth</li>
                  <li>ONNX Runtime + int8 quantization</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Backend</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>FastAPI + Uvicorn, WebSockets</li>
                  <li>Pydantic schemas, Redis, PostgreSQL</li>
                  <li>ffmpeg for codec simulation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Frontend & DevOps</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>Next.js 14, React 18, Tailwind CSS</li>
                  <li>Recharts for live visualizations</li>
                  <li>Docker Compose, GitHub Actions</li>
                  <li>Vercel deployment</li>
                </ul>
              </div>
            </div>
          </article>

          <article className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Differentiators</h2>
            <div className="space-y-4">
              {[
                'India-first robustness: multilingual backbone, Indian-language fake data, per-language results',
                'Phone-call realism: trained and tested through 8 kHz codecs, noise and packet loss',
                'Detect + prevent: policy engine ties the score to transaction context and step-up verification',
                'Active challenge-response when passive analysis is unsure',
                'Explainable risk: per-layer contribution shown to the agent',
                'Privacy by design: edge inference, RAM-only audio, feature-only logs',
                'Tamper-evident audit ledger (hash chain, optional chain anchor)',
                'Honest generalisation testing: unseen-generator results and update pipeline',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">{i + 1}.</span>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Who Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Banks & financial institutions: catch impersonated approvals before funds move',
                'Enterprises: protect finance, HR and IT-helpdesk workflows from CXO impersonation',
                'Government agencies: safeguard high-stakes instructions and citizen-facing helplines',
                'Telecom operators: reusable security layer sold or offered as a network service',
                'Citizens: fewer family-emergency and "digital arrest" style scam successes',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ethics & Responsible Use</h2>
            <ul className="space-y-3 text-gray-700">
              <li>• Clone only voices of consenting teammates or open-licensed reference audio</li>
              <li>• Never clone real public figures or third parties without explicit consent</li>
              <li>• Check each dataset and model license before use</li>
              <li>• Voiceprints stored only with explicit user consent</li>
              <li>• Raw audio never persisted — only features and hashes leave the trust boundary</li>
              <li>• All evaluation data sourced from public benchmarks (ASVspoof, WaveFake, Common Voice, IndicVoices)</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}