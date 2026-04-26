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
