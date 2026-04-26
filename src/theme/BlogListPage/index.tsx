import { useState, useEffect, useRef, useCallback } from 'react'
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
    <p style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.7rem',
      letterSpacing: '0.18em',
      color: 'var(--lp-teal)',
      marginBottom: '12px',
      fontWeight: 700,
    }}>
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
    <section ref={ref} className="lp-section" style={{ padding: '120px 24px' }}>
      <div style={{ maxWidth: 'var(--lp-max)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel text="DEPLOYMENT MODES" />
          <h2 style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: 'var(--lp-text)', marginBottom: 16 }}>
            See single-provider and hybrid before you open the wizard
          </h2>
          <p style={{ color: 'var(--lp-muted)', maxWidth: 760, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.8 }}>
            The onboarding wizard uses architecture previews to explain what changes when you choose one provider path for the whole clawster versus mixing provider types by role. These are the same diagrams you will see in Step 1.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
          <article style={{ background: 'var(--lp-card)', border: '1px solid var(--lp-border)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--lp-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--lp-teal)', marginBottom: 6 }}>
                    {singleIllustration.eyebrow.toUpperCase()}
                  </div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.15rem', color: 'var(--lp-text)', margin: 0, fontWeight: 700 }}>
                    {singleIllustration.title}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(Object.keys(providerExamples) as ProviderType[]).map(type => {
                  const selected = type === activeSingleType
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setActiveSingleType(type)}
                      style={{
                        borderRadius: 999,
                        border: selected ? '1px solid rgba(17,147,176,0.45)' : '1px solid var(--lp-border)',
                        background: selected ? 'rgba(17,147,176,0.12)' : 'rgba(255,255,255,0.03)',
                        color: selected ? 'var(--lp-text)' : 'var(--lp-muted)',
                        padding: '8px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {providerExamples[type].label}
                    </button>
                  )
                })}
              </div>
            </div>

            <img src={singleIllustration.src} alt={singleIllustration.alt} style={{ width: '100%', display: 'block', aspectRatio: '12 / 7', objectFit: 'cover', background: '#0D1520' }} />

            <div style={{ padding: 20 }}>
              <p style={{ color: 'var(--lp-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginTop: 0, marginBottom: 12 }}>
                {singleExample.vendorName} / {singleExample.name} becomes the one provider path for every claw in the clawster.
              </p>
              <p style={{ color: 'var(--lp-dim)', fontSize: '0.84rem', lineHeight: 1.7, marginTop: 0, marginBottom: 16 }}>
                {singleExample.note}
              </p>
              <div style={{ display: 'grid', gap: 8 }}>
                {singleIllustration.bullets.map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--lp-teal)', marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--lp-muted)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article style={{ background: 'var(--lp-card)', border: '1px solid var(--lp-border)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--lp-border)' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em', color: '#8FE2F2', marginBottom: 6 }}>
                {hybridIllustration.eyebrow.toUpperCase()}
              </div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.15rem', color: 'var(--lp-text)', margin: 0, fontWeight: 700 }}>
                {hybridIllustration.title}
              </h3>
            </div>

            <img src={hybridIllustration.src} alt={hybridIllustration.alt} style={{ width: '100%', display: 'block', aspectRatio: '12 / 7', objectFit: 'cover', background: '#0D1520' }} />

            <div style={{ padding: 20 }}>
              <p style={{ color: 'var(--lp-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginTop: 0, marginBottom: 12 }}>
                Start with one primary provider binding, then place specific claw roles where they fit best, such as VPS at the edge, Kubernetes for workers, and cloud services for managed integrations.
              </p>
              <p style={{ color: 'var(--lp-dim)', fontSize: '0.84rem', lineHeight: 1.7, marginTop: 0, marginBottom: 16 }}>
                Hybrid is the right fit when one provider path is not ideal for every claw role or lifecycle boundary.
              </p>
              <div style={{ display: 'grid', gap: 8 }}>
                {hybridIllustration.bullets.map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#8FE2F2', marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--lp-muted)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
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
            {/* <div className="lr-stat-row">
              <div className="lr-stat-card">
                <strong>{metadata.totalCount}</strong>
                <span>Field notes</span>
              </div>
              <div className="lr-stat-card">
                <strong>{yearsOfWriting}</strong>
                <span>Years in motion</span>
              </div>
              <div className="lr-stat-card">
                <strong>{topTags.length}</strong>
                <span>Topic lanes</span>
              </div>
            </div> */}
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

        <section className="lr-section lr-rollout-section">
          <Reveal className="lr-section-heading">
            <div>
              <span className="lr-eyebrow">[GO LIVE PATH]</span>
              <h2>Make the homepage do two jobs: educate and convert.</h2>
            </div>
            <p>
              Use the field notes as proof, the docs as onboarding, and the calls to action as a
              clear handoff into a demo conversation or early-access registration.
            </p>
          </Reveal>

          <div className="lr-rollout-grid">
            {rolloutSteps.map((step) => (
              <Reveal key={step.label} className="lr-surface-card lr-rollout-card">
                <span className="lr-rollout-card__label">{step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="lr-conversion-panel" delay={140}>
            <div>
              <span className="lr-eyebrow">[NEXT STEP]</span>
              <h3>Want to see My Clawster in a real deployment conversation?</h3>
              <p>
                Request a walkthrough if you are evaluating self-hosted agent infrastructure, or
                join the updates stream if you want releases, docs, and launch notes as they land.
              </p>
            </div>
            <div className="lr-conversion-actions">
              <Link className="lr-button lr-button--primary" href={social.linkedin}>
                <span>Request a demo</span>
                <ArrowTipIcon width={16} height={16} />
              </Link>
              <Link className="lr-button" to="/subscribe">
                Join updates
              </Link>
              <Link className="lr-button" to="/docs">
                Explore docs
              </Link>
            </div>
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
