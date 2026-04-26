import { useState, useEffect, useRef } from 'react'
import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import type {Props} from '@theme/BlogListPage';
import NewsletterPanel from '@site/src/components/NewsletterPanel';
import Reveal from '@site/src/components/Reveal';
import {ArrowTipIcon} from '@site/src/components/icons';
import {useSiteData} from '@site/src/components/site';

const valuePillars = [
  {
    title: 'Own the runtime',
    description:
      'Keep agent routing, model access, and workspace isolation inside infrastructure your team can inspect and control.',
  },
  {
    title: 'Ship across providers',
    description:
      'Run the same operational model across VPS, Kubernetes, and hybrid footprints without rebuilding your control plane.',
  },
  {
    title: 'Stay demo-ready',
    description:
      'Deploy "Claws" (OpenClaw, or Hermes instances) in a way that supports demos, onboarding, and security reviews without hand-holding.',
  },
] as const;

const operatorLanes = [
  {
    title: 'Workspace isolation',
    description:
      'Separate customer, project, or environment contexts without giving up cluster-level visibility.',
  },
  {
    title: 'Model routing',
    description:
      'Blend Ollama, hosted APIs, MCPs, and BYOK policies with one operational story instead of fragmented scripts.',
  },
  {
    title: 'Provider mobility',
    description:
      'Start a VPS today, move into Kubernetes tomorrow, and keep the workflows recognizable for your team.',
  },
] as const;

const rolloutSteps = [
  {
    label: '01',
    title: 'Map your current agent surface',
    description:
      'Identify the frameworks, workspaces, and provider assumptions you already support so the rollout matches reality.',
  },
  {
    label: '02',
    title: 'Pilot on one high-signal workflow',
    description:
      'Stand up a contained cluster for one team, one customer segment, or one internal ops lane and prove the operating model.',
  },
  {
    label: '03',
    title: 'Standardize from docs and field notes',
    description:
      'Turn the pilot into repeatable cluster patterns with docs, release notes, and a buyer-friendly demo narrative.',
  },
] as const;

const deploymentHighlights = [
  {
    value: '1',
    label: 'starts visually',
    description: 'Same architecture framing inside the onboarding, all users see the same story.',
  },
  {
    value: '2',
    label: 'operating modes',
    description: 'Choose one provider path for every claw or split roles across multiple provider types.',
  },
  {
    value: '3',
    label: 'provider lanes',
    description: 'VPS, cloud, and Kubernetes previews are shown before the wizard asks you to commit.',
  }
] as const;

type ProviderType = 'vps' | 'cloud' | 'kubernetes'
type ClawsterMode = 'single' | 'hybrid'
interface ProviderOffering {
  id: string
  providerVendorId: string
  vendorSlug: string
  vendorName: string
  slug: string
  name: string
  providerType: ProviderType
  description: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}
interface ProviderModeIllustration {
  src: string
  alt: string
  eyebrow: string
  title: string
  description: string
  bullets: string[]
}

const SINGLE_GENERIC: ProviderModeIllustration = {
  src: '/wizard-diagrams/clawster-single-generic.svg',
  alt: 'Diagram of a single-provider clawster where all claw roles use one provider offering.',
  eyebrow: 'Single provider',
  title: 'Everything inherits one provider path',
  description: 'Choose one provider offering and every claw in this clawster will use the same provider type, region, and control surface.',
  bullets: [
    'Lowest operational complexity for teams starting fresh.',
    'One provider binding is shared by gateway, workers, and support claws.',
    'Good default when you want the simplest deployment story.',
  ],
}
const SINGLE_BY_PROVIDER: Record<ProviderType, ProviderModeIllustration> = {
  vps: {
    src: '/wizard-diagrams/clawster-single-vps.svg',
    alt: 'Diagram of a single-provider VPS clawster with all claw roles running through one VM provider path.',
    eyebrow: 'Single provider · VPS',
    title: 'One VPS fleet for every claw',
    description: 'All claws are provisioned through one VPS provider, which keeps networking, access control, and VM lifecycle management aligned.',
    bullets: [
      'Gateway, worker, and support claws all follow the same VM-style path.',
      'Useful for teams that want straightforward host-level control.',
      'Examples: Contabo, Hetzner, Vultr, or similar VPS offerings.',
    ],
  },
  cloud: {
    src: '/wizard-diagrams/clawster-single-cloud.svg',
    alt: 'Diagram of a single-provider cloud clawster where all claw roles stay inside one cloud network.',
    eyebrow: 'Single provider · Cloud',
    title: 'One cloud topology for every claw',
    description: 'All claws stay inside one cloud account and region, so networking, IAM, and scaling rules remain consistent across the whole clawster.',
    bullets: [
      'All claw roles share one cloud networking and policy surface.',
      'Good when the whole clawster should live in one provider account.',
      'Examples: AWS, Azure, GCP, or private cloud-style offerings.',
    ],
  },
  kubernetes: {
    src: '/wizard-diagrams/clawster-single-kubernetes.svg',
    alt: 'Diagram of a single-provider Kubernetes clawster where every claw runs through one Kubernetes cluster path.',
    eyebrow: 'Single provider · Kubernetes',
    title: 'One Kubernetes path for every claw',
    description: 'Every claw runs through the same Kubernetes provider binding, which makes cluster policy, namespaces, and pod scheduling consistent across roles.',
    bullets: [
      'All claws share one kube context and deployment path.',
      'Best when every role should stay under one cluster control plane.',
      'Examples: K3s, AKS, EKS, GKE, or an existing managed cluster.',
    ],
  },
}

const HYBRID_BASE: ProviderModeIllustration = {
  src: '/wizard-diagrams/clawster-hybrid.svg',
  alt: 'Diagram of a hybrid clawster with different claw roles distributed across VPS, Kubernetes, and cloud provider paths.',
  eyebrow: 'Hybrid',
  title: 'Mix provider types by claw role',
  description: 'Step 1 still creates the primary provider binding, but later steps can assign different claw roles to better-fitting provider types and bindings.',
  bullets: [
    'Keep a shared clawster identity while splitting roles across provider types.',
    'Useful for patterns like VPS gateways plus Kubernetes workers.',
    'Best when one provider path is not ideal for every role.',
  ],
}

// ─── SVG Mascot ─────────────────────────────────────────────────────────────────

function MascotSVG({ size = 220 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'float-mascot 4s ease-in-out infinite', filter: 'drop-shadow(0 0 24px rgba(17,147,176,0.35))' }}>
      {/* Connection lines from claws to nodes */}
      <line x1="110" y1="110" x2="30" y2="40" stroke="#1193b0" strokeWidth="0.8" opacity="0.4" />
      <line x1="110" y1="110" x2="190" y2="40" stroke="#1193b0" strokeWidth="0.8" opacity="0.4" />
      <line x1="110" y1="110" x2="20" y2="150" stroke="#1193b0" strokeWidth="0.8" opacity="0.4" />
      <line x1="110" y1="110" x2="200" y2="150" stroke="#1193b0" strokeWidth="0.8" opacity="0.4" />
      <line x1="110" y1="110" x2="55" y2="195" stroke="#1193b0" strokeWidth="0.8" opacity="0.4" />
      <line x1="110" y1="110" x2="165" y2="195" stroke="#1193b0" strokeWidth="0.8" opacity="0.4" />
      {/* Node dots */}
      {[[30,40],[190,40],[20,150],[200,150],[55,195],[165,195]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#1193b0" opacity="0.7"
          style={{ animation: `pulse-dot ${1.5 + i*0.3}s ease-in-out infinite` }} />
      ))}
      {/* Body — lobster/crab shell */}
      <ellipse cx="110" cy="118" rx="38" ry="32" fill="#111820" stroke="#1193b0" strokeWidth="1.5" />
      {/* Shell ridges */}
      <path d="M 82 105 Q 110 98 138 105" stroke="#1193b0" strokeWidth="0.8" opacity="0.6" fill="none" />
      <path d="M 78 115 Q 110 107 142 115" stroke="#1193b0" strokeWidth="0.8" opacity="0.5" fill="none" />
      <path d="M 80 125 Q 110 118 140 125" stroke="#1193b0" strokeWidth="0.8" opacity="0.4" fill="none" />
      {/* Eyes */}
      <circle cx="98" cy="100" r="5" fill="#1193b0" opacity="0.9" />
      <circle cx="122" cy="100" r="5" fill="#1193b0" opacity="0.9" />
      <circle cx="99" cy="99" r="2" fill="#08080d" />
      <circle cx="123" cy="99" r="2" fill="#08080d" />
      {/* Eye shine */}
      <circle cx="100" cy="98" r="1" fill="white" opacity="0.7" />
      <circle cx="124" cy="98" r="1" fill="white" opacity="0.7" />
      {/* Left claw arm */}
      <path d="M 80 108 Q 60 95 45 82" stroke="#1193b0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 45 82 Q 35 73 30 65" stroke="#1193b0" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 45 82 Q 38 76 36 70" stroke="#1193b0" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Right claw arm */}
      <path d="M 140 108 Q 160 95 175 82" stroke="#1193b0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 175 82 Q 185 73 190 65" stroke="#1193b0" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 175 82 Q 182 76 184 70" stroke="#1193b0" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <path d="M 90 142 Q 75 155 65 168" stroke="#1193b0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M 100 146 Q 90 162 84 178" stroke="#1193b0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M 120 146 Q 130 162 136 178" stroke="#1193b0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M 130 142 Q 145 155 155 168" stroke="#1193b0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* Antennae */}
      <path d="M 103 95 Q 92 80 82 65" stroke="#1193b0" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M 117 95 Q 128 80 138 65" stroke="#1193b0" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Tail */}
      <path d="M 95 148 Q 110 162 125 148" stroke="#1193b0" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M 100 152 Q 110 168 120 152" stroke="#1193b0" strokeWidth="1.2" fill="none" opacity="0.5" />
    </svg>
  )
}

// ─── Constellation Background ────────────────────────────────────────────────────

function ConstellationBg() {
  const dots = [
    [15,12],[35,8],[55,18],[72,5],[88,14],[10,35],[28,28],[48,40],[65,25],[80,38],
    [92,20],[5,55],[22,48],[40,60],[58,52],[75,45],[90,58],[12,72],[30,68],[50,75],
    [68,65],[85,72],[95,80],[8,88],[25,85],[45,92],[62,80],[78,88],[92,95],[18,95],
  ]
  const lines = [
    [0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[8,9],[9,10],[11,12],[12,13],[13,14],
    [14,15],[15,16],[17,18],[18,19],[19,20],[20,21],[22,23],[24,25],[25,26],[26,27],
    [0,5],[5,11],[11,17],[17,22],[4,9],[9,10],[1,6],[6,12],[12,18],[18,24],
  ]
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {lines.map(([a,b], i) => {
        const da = dots[a]!, db = dots[b]!
        return (
          <line key={i} x1={da[0]} y1={da[1]} x2={db[0]} y2={db[1]}
            stroke="#1193b0" strokeWidth="0.12"
            style={{ animation: `pulse-line ${2 + (i % 4) * 0.5}s ease-in-out infinite`, animationDelay: `${(i * 0.15) % 3}s` }} />
        )
      })}
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.6" fill="#1193b0"
          style={{ animation: `pulse-dot ${1.5 + (i % 5) * 0.4}s ease-in-out infinite`, animationDelay: `${(i * 0.2) % 4}s` }} />
      ))}
    </svg>
  )
}

// ─── Shared Utilities ───────────────────────────────────────────────────────────

function useFadeIn() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        el.classList.add('is-visible')
        obs.disconnect()
      }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref as React.RefObject<any>
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="lr-eyebrow lr-deployment-label">
      [{text}]
    </p>
  )
}

export function getProviderModeIllustration(
  clusterMode: ClawsterMode,
  offering: Pick<ProviderOffering, 'providerType' | 'vendorName' | 'name'> | null,
): ProviderModeIllustration {
  if (clusterMode === 'hybrid') {
    if (!offering) return HYBRID_BASE

    return {
      ...HYBRID_BASE,
      description: `${offering.vendorName} / ${offering.name} becomes the primary binding first. In step 2, each claw role can still diverge to VPS, cloud, or Kubernetes paths when needed.`,
    }
  }

  if (!offering) return SINGLE_GENERIC

  return {
    ...SINGLE_BY_PROVIDER[offering.providerType],
    description: `${offering.vendorName} / ${offering.name} is the single provider path for this clawster, so every claw inherits the same provider type and topology.`,
  }
}
function DeploymentModesSection() {
  const ref = useFadeIn()
  const [activeSingleType, setActiveSingleType] = useState<ProviderType>('vps')

  const providerExamples: Record<ProviderType, { label: string; vendorName: string; name: string; providerType: ProviderType; note: string }> = {
    vps: {
      label: 'VPS',
      vendorName: 'Vultr',
      name: 'General Purpose VPS',
      providerType: 'vps',
      note: 'Best when you want straightforward host-level control and one VM-style path for every claw.',
    },
    cloud: {
      label: 'Cloud',
      vendorName: 'AWS',
      name: 'eu-west-1 foundation',
      providerType: 'cloud',
      note: 'Best when every claw should stay inside one cloud account, network boundary, and policy surface.',
    },
    kubernetes: {
      label: 'Kubernetes',
      vendorName: 'K3s',
      name: 'Shared cluster binding',
      providerType: 'kubernetes',
      note: 'Best when every claw belongs under one cluster control plane, namespace strategy, and scheduling model.',
    },
  }

  const singleExample = providerExamples[activeSingleType]
  const singleIllustration = getProviderModeIllustration('single', singleExample)
  const hybridIllustration = getProviderModeIllustration('hybrid', {
    vendorName: 'Contabo',
    name: 'Primary VPS edge',
    providerType: 'vps',
  })

  return (
    <section ref={ref} className="lr-section lr-deployment-modes">
      <div className="lr-deployment-modes__inner">
        <Reveal className="lr-home-hero__copy">
        <div className="lr-deployment-hero">
          <div className="lr-section-heading lr-deployment-modes__intro">
            <span className="lr-eyebrow">DEPLOYMENT MODES</span>
            <h2>
              Wizard-guided: Single-provider or hybrid.
            </h2>
            <p>
              The onboarding wizard uses architecture previews to explain what changes when you choose one provider path for the whole clawster versus mixing provider types by role.
            </p>
          </div>

          <aside className="lr-surface-card lr-deployment-spotlight">
            <span className="lr-eyebrow">[AT A GLANCE]</span>
            <div className="lr-stat-row lr-deployment-stat-row">
              {deploymentHighlights.map(item => (
                <div key={item.label} className="lr-stat-card lr-deployment-stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
        </Reveal>
        <div className="lr-topic-strip lr-deployment-chip-row" aria-label="Deployment mode highlights">
          <span className="lr-topic-chip">Single path for every claw</span>
          <span className="lr-topic-chip">Hybrid placement by role</span>
          <span className="lr-topic-chip">Preview-first onboarding</span>
          <span className="lr-topic-chip">Buyer-friendly architecture story</span>
        </div>

        <Reveal className="lr-home-hero__copy">
        <div className="lr-deployment-grid">
          <article className="lr-surface-card lr-deployment-card">
            <div className="lr-deployment-card__header">
              <div className="lr-deployment-card__title-wrap">
                <div>
                  <div className="lr-deployment-card__eyebrow">
                    {singleIllustration.eyebrow.toUpperCase()}
                  </div>
                  <h3>{singleIllustration.title}</h3>
                  <p className="lr-deployment-card__summary">Fastest path to one repeatable deployment story across the entire clawster.</p>
                </div>
              </div>

              <div className="lr-deployment-tabs">
                {(Object.keys(providerExamples) as ProviderType[]).map(type => {
                  const selected = type === activeSingleType
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setActiveSingleType(type)}
                      className={[
                        'lr-deployment-tab',
                        selected ? 'lr-deployment-tab--active' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {providerExamples[type].label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="lr-deployment-card__media">
              <img src={singleIllustration.src} alt={singleIllustration.alt} />
            </div>

            <div className="lr-deployment-card__body">
              <p className="lr-deployment-card__lead">
                {singleExample.vendorName} / {singleExample.name} becomes the one provider path for every claw in the clawster.
              </p>
              <p className="lr-deployment-card__note">
                {singleExample.note}
              </p>
              <ul className="lr-bullet-list lr-deployment-bullets">
                {singleIllustration.bullets.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>

          <article className="lr-surface-card lr-deployment-card lr-deployment-card--hybrid">
            <div className="lr-deployment-card__header">
              <div className="lr-deployment-card__eyebrow lr-deployment-card__eyebrow--hybrid">
                {hybridIllustration.eyebrow.toUpperCase()}
              </div>
              <h3>{hybridIllustration.title}</h3>
              <p className="lr-deployment-card__summary">Best when demos, workers, gateways, and managed integrations should not share one provider constraint.</p>
            </div>

            <div className="lr-deployment-card__media">
              <img src={hybridIllustration.src} alt={hybridIllustration.alt} />
            </div>

            <div className="lr-deployment-card__body">
              <p className="lr-deployment-card__lead">
                Start with one primary provider binding, then place specific claw roles where they fit best, such as VPS at the edge, Kubernetes for workers, and cloud services for managed integrations.
              </p>
              <p className="lr-deployment-card__note">
                Hybrid is the right fit when one provider path is not ideal for every claw role or lifecycle boundary.
              </p>
              <ul className="lr-bullet-list lr-deployment-bullets lr-deployment-bullets--hybrid">
                {hybridIllustration.bullets.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>
        </Reveal>
      </div>
    </section>
  )
}

function MarqueeSection() {
  const rows = [
    { items: ['DEPLOY AGENTS','CONNECT CHANNELS','ROUTE TASKS','ISOLATE WORKSPACES','MANAGE CREDENTIALS','MONITOR COSTS','SCHEDULE CRON','CONFIGURE MODELS'], dir: 'right', speed: 'marquee-right' },
    { items: ['WHATSAPP','TELEGRAM','DISCORD','SLACK','SIGNAL','iMESSAGE','MATRIX','TEAMS','WEBCHAT','IRC','NOSTR','LINE','FEISHU'], dir: 'left', speed: 'marquee-left' },
    { items: ['CLAUDE','GPT-4o','GEMINI','DEEPSEEK','LLAMA 4','MINIMAX','OLLAMA','OPENROUTER','CUSTOM ENDPOINTS'], dir: 'right', speed: 'marquee-right-slow' },
    { items: ['SELF-IMPROVING','EPISODIC MEMORY','PERSISTENT SESSIONS','HEARTBEAT SCHEDULING','CONTAINER ISOLATION','AUDIT TRAILS','GIT VERSIONING','COST DASHBOARDS'], dir: 'left', speed: 'marquee-left-slow' },
  ]
  return (
    <div className='lr-full-bleed' style={{ padding: '80px 0', overflow: 'hidden', position: 'relative' }}>
      {/* Gradient masks */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to right, var(--lr-bg) 0%, transparent 12%, transparent 88%, var(--lr-bg) 100%)',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {rows.map((row, ri) => {
          const doubled = [...row.items, ...row.items]
          return (
            <div key={ri} style={{ overflow: 'hidden' }}>
              <div className={row.speed} style={{ display: 'flex', gap: 32, whiteSpace: 'nowrap', width: 'max-content' }}>
                {doubled.map((item, i) => (
                  <span key={i} style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    color: (i % 3 === 2) ? 'var(--lr-teal)' : 'var(--lr-dim)',
                    opacity: (i % 3 === 2) ? 0.7 : 0.4,
                  }}>
                    {item}
                    <span style={{ marginLeft: 32, color: 'var(--lr-dim)', opacity: 0.3 }}>•</span>
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CommunitySection() {
  const ref = useFadeIn()
  const countersRef = useRef<HTMLDivElement>(null)
  const animated = useRef(false)
  const stats = [
    { value: 100, suffix: 'K+', label: 'OpenClaw Stars' },
    { value: 64, suffix: 'K+', label: 'Hermes Stars' },
    { value: 50, suffix: '+', label: 'Channels' },
    { value: 200, suffix: '+', label: 'Models' },
  ]
  const displayRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const el = countersRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !animated.current) {
        animated.current = true
        stats.forEach((stat, i) => {
          const span = displayRefs.current[i]
          if (!span) return
          const start = performance.now()
          const duration = 1200
          function frame(now: number) {
            const t = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - t, 3)
            span!.textContent = Math.floor(ease * stat.value) + stat.suffix
            if (t < 1) requestAnimationFrame(frame)
          }
          requestAnimationFrame(frame)
        })
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="lr-section lr-dotgrid lr-full-bleed" style={{ padding: '120px 24px' }}>
      <div className="lr-full-bleed__inner" style={{ textAlign: 'center' }}>
        <SectionLabel text="COMMUNITY" />
        <h2 style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: 'var(--lr-text)', marginBottom: 16 }}>
          Built by builders who run their own agents
        </h2>
        <p style={{ color: 'var(--lr-muted)', marginBottom: 48, fontSize: '1rem', maxWidth: 480, margin: '0 auto 48px' }}>
          Open source, MIT licensed — your agents, your data, your rules.
        </p>
        <div ref={countersRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 32, marginBottom: 48 }}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--lr-teal)', marginBottom: 6 }}>
                <span ref={el => { displayRefs.current[i] = el }}>0{stat.suffix}</span>
              </div>
              <div style={{ color: 'var(--lr-dim)', fontSize: '0.8rem', letterSpacing: '0.08em', fontFamily: "'Space Mono', monospace" }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <a href="https://github.com/la-rebelion/clawster" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'var(--lr-teal)', border: '1px solid var(--lr-teal)', borderRadius: 8, padding: '12px 24px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(17,147,176,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
            Star on GitHub
          </a>
          <a href="https://discord.gg/clawster" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'var(--lr-text)', border: '1px solid var(--lr-border)', borderRadius: 8, padding: '12px 24px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--lr-teal)'; e.currentTarget.style.color = 'var(--lr-teal)' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--lr-border)'; e.currentTarget.style.color = 'var(--lr-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
            Join Discord
          </a>
        </div>
        <p style={{ color: 'var(--lr-dim)', fontSize: '0.82rem', fontFamily: "'Space Mono', monospace" }}>
          <span style={{ color: 'var(--lr-teal)' }}>247</span> clusters deployed and counting
        </p>
      </div>
    </section>
  )
}

function FinalCTASection({ onDeploy }: { onDeploy: () => void }) {
  const ref = useFadeIn()
  return (
    <section ref={ref} className="lr-section lr-dotgrid lr-full-bleed" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
      <div className="lr-glow-teal-sm" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <ConstellationBg />
      <div className="lr-full-bleed__inner" style={{ maxWidth: 720, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 32 }}>
          <MascotSVG size={120} />
        </div>
        <h2 style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          color: 'var(--lr-text)',
          lineHeight: 1.1,
          marginBottom: 20,
        }}>
          Own your agents.<br />
          <span style={{ color: 'var(--lr-teal)' }}>Own your stack.</span>
        </h2>
        <p style={{ color: 'var(--lr-muted)', fontSize: '1.05rem', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
          Deploy your first cluster in 5 minutes. No vendor lock-in.<br/> My Clawster is <span className='claws-text' style={{fontSize: '1.15rem'}}>open source.</span>
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onDeploy}
            style={{ background: 'var(--lr-teal)', color: '#fff', border: 'none', borderRadius: 8, padding: '16px 36px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = '#0d7a94')}
            onMouseOut={e => (e.currentTarget.style.background = 'var(--lr-teal)')}
          >
            Deploy Your First Cluster
          </button>
          <a href="https://github.com/la-rebelion/clawster" target="_blank" rel="noopener noreferrer"
            style={{ background: 'transparent', color: 'var(--lr-text)', border: '1px solid var(--lr-border)', borderRadius: 8, padding: '16px 28px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1rem', textDecoration: 'none', transition: 'border-color 0.2s', display: 'inline-block' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--lr-teal)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--lr-border)')}>
            Star on GitHub
          </a>
          <a href="https://discord.gg/clawster" target="_blank" rel="noopener noreferrer"
            style={{ background: 'transparent', color: 'var(--lr-text)', border: '1px solid var(--lr-border)', borderRadius: 8, padding: '16px 28px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1rem', textDecoration: 'none', transition: 'border-color 0.2s', display: 'inline-block' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--lr-teal)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--lr-border)')}>
            Join Discord
          </a>
        </div>
      </div>
    </section>
  )
}

function BlogListPageMetadata(props: Props): ReactNode {
  const {metadata} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;

  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function getTopTags(props: Props) {
  const byTag = new Map<string, {label: string; permalink: string; count: number}>();

  props.items.forEach(({content}) => {
    content.metadata.tags.forEach((tag) => {
      const current = byTag.get(tag.permalink);
      byTag.set(tag.permalink, {
        label: tag.label,
        permalink: tag.permalink,
        count: (current?.count ?? 0) + 1,
      });
    });
  });

  return [...byTag.values()].sort((left, right) => right.count - left.count).slice(0, 6);
}

function BlogListPageContent(props: Props): ReactNode {
  const {metadata, items, sidebar} = props;
  const {clawster, brand, social} = useSiteData();
  const latestPost = items[0]?.content;
  const topTags = getTopTags(props);
  const yearsOfWriting = new Date().getFullYear() - brand.foundedYear + 1;
  const lanes = ['OpenClaw', 'Hermes', 'Ollama', 'Kubernetes', 'VPS', 'BYOK'];

  return (
    <BlogLayout sidebar={sidebar}>
      <div className="lr-home">
        <section className="lr-home-hero">
          <Reveal className="lr-home-hero__copy">
            <span className="lr-eyebrow">[SELF-HOSTABLE AGENT OPS]</span>
            <h1>A control room for teams running their own agent clusters.</h1>
            <p>
              {brand.summary}<br/>Deploy <span className="claws-text">OpenClaw</span>, <span className="claws-text">Hermes</span>, and any open-source agent 
              framework — orchestrated together in isolated workspaces. 
              Runs <span className="claws-green-text">on-premise, cloud, or hybrid</span>. No vendor lock-in. Your data, your rules.
            </p>
            Get your <span className="claws-orange-text">self-hosted AI agent</span> clusters up and running without the ops overhead.
            <div className="lr-hero-actions">
              <Link className="lr-button lr-button--primary" to={clawster.controlPlane}>
                <span>Deploy Your First Clawster</span>
                <ArrowTipIcon width={16} height={16} />
              </Link>
              <Link className="lr-button" to="/docs">
                Read the docs
              </Link>
            </div>
          </Reveal>
          <Reveal className="lr-home-hero__stage" delay={120}>
            <div className="lr-signal-card">
              <div className="lr-signal-card__grid" />
              <div className="lr-constellation" aria-hidden="true">
                {lanes.map((lane, index) => (
                  <span key={lane} style={{'--node-index': index} as React.CSSProperties}>
                    {lane}
                  </span>
                ))}
              </div>
              <img className="lr-signal-card__mark" src="/img/brand/my-clawster.png" alt="" />
              <div className="lr-product-shot">
                <img src="/img/brand/clawsters-overview.png" alt="My Clawster cluster overview dashboard" />
              </div>
              <div className="lr-terminal-card">
                <div className="lr-terminal-card__bar">
                  <span />
                  <span />
                  <span />
                  <b>fish</b>
                </div>
                <code>
                  <span>$ clawster status --workspace prod</span>
                  <span>gateway: online</span>
                  <span>workers: 12 isolated</span>
                  <span>egress: allowlist clean</span>
                </code>
              </div>
              {latestPost ? (
                <div className="lr-signal-card__preview">
                  <span className="lr-eyebrow">Latest field note</span>
                  <Link to={latestPost.metadata.permalink}>{latestPost.metadata.title}</Link>
                  <p>{latestPost.metadata.description}</p>
                </div>
              ) : null}
            </div>
          </Reveal>
        </section>

        <section className="lr-section lr-landing-band">
          <Reveal className="lr-section-heading">
            <div>
              <span className="lr-eyebrow">[WHY MY CLAWSTER]</span>
              <h2>Bring agent infrastructure in-house without turning ops into a side project.</h2>
            </div>
            <p>
              The best-fit teams want control over isolation, provider choice, and model policy,
              but they still need a clear story for demos, onboarding, and stakeholder trust.
            </p>
          </Reveal>

          <div className="lr-value-grid">
            {valuePillars.map((pillar) => (
              <Reveal key={pillar.title} className="lr-surface-card lr-value-card">
                <span className="lr-eyebrow">[{pillar.title.toUpperCase()}]</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <DeploymentModesSection />
        
        <section className="lr-section lr-ops-showcase">
          <Reveal className="lr-surface-card lr-ops-showcase__panel">
            <div className="lr-card-header">
              <span className="lr-eyebrow">[OPERATING MODEL]</span>
              <h3>The platform shape teams ask for after the first successful pilot.</h3>
              <p>
                A reusable cluster layer for agent frameworks, policy boundaries, and provider
                mobility, without surrendering ownership of the runtime.
              </p>
            </div>

            <div className="lr-lane-list">
              {operatorLanes.map((lane) => (
                <article key={lane.title} className="lr-lane-item">
                  <div className="lr-lane-item__index" aria-hidden="true" />
                  <div>
                    <h4>{lane.title}</h4>
                    <p>{lane.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal className="lr-surface-card lr-proof-panel" delay={120}>
            <span className="lr-eyebrow">[CLUSTER SIGNAL]</span>
            <h3>What buyers and operators need to see fast.</h3>
            <div className="lr-proof-terminal" role="presentation">
              <code>
                <span>$ clawster deploy --workspace eu-prod --provider hybrid</span>
                <span>policy pack: byok-enforced</span>
                <span>gateway pods: healthy</span>
                <span>ollama lane: ready</span>
                <span>audit surface: clean</span>
              </code>
            </div>
            <ul className="lr-bullet-list lr-proof-list">
              <li>Clear isolation story for enterprise demos and security reviews.</li>
              <li>Provider flexibility without forcing teams into bespoke tooling.</li>
              <li>Documentation and release notes that support onboarding after the demo.</li>
            </ul>
          </Reveal>
        </section>

        <section id="latest" className="lr-section">
          <Reveal className="lr-section-heading">
            <div>
              <span className="lr-eyebrow">[LATEST]</span>
              <h2>Operational notes from the cluster edge</h2>
            </div>
            <p>
              Architecture decisions, provider notes, deployment patterns, and product thinking
              for teams that want agent infrastructure without vendor handcuffs.
            </p>
          </Reveal>
          {topTags.length ? (
            <div className="lr-topic-strip">
              {topTags.map((tag) => (
                <Link key={tag.permalink} className="lr-topic-chip" to={tag.permalink}>
                  {tag.label}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="lr-post-grid">
            <BlogPostItems items={items} />
          </div>
        </section>

        <NewsletterPanel />
        <BlogListPaginator metadata={metadata} />

        <MarqueeSection />
        <CommunitySection />
        <FinalCTASection onDeploy={() => window.location.href = clawster.controlPlane} />
      </div>
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={[
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      ].join(' ')}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
