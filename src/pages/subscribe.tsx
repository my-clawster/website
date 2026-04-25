import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import NewsletterPanel from '@site/src/components/NewsletterPanel';
import Reveal from '@site/src/components/Reveal';
import {useSiteData} from '@site/src/components/site';

export default function SubscribePage() {
  const {brand, social} = useSiteData();

  return (
    <Layout
      title="Updates"
      description="Subscribe to My Clawster for release notes, architecture guides, and practical field notes on self-hosted agent infrastructure.">
      <main className="lr-subscribe-page">
        <div className="lr-site-shell">
          <Reveal className="lr-subscribe-hero">
            <span className="lr-eyebrow">[UPDATES]</span>
            <h1>Follow the cluster notes, not the noise.</h1>
            <p>
              {brand.summary} New release notes and architecture guides land here first,
              then travel to the inbox for operators who want the deeper thread.
            </p>
          </Reveal>
          <div className="lr-subscribe-grid">
            <NewsletterPanel variant="surface" />
            <Reveal className="lr-subscribe-notes" delay={120}>
              <div className="lr-surface-card">
                <span className="lr-eyebrow">What you get</span>
                <ul className="lr-bullet-list">
                  <li>Hands-on posts about agent gateways, providers, workspaces, and deployment patterns.</li>
                  <li>Opinionated breakdowns of self-hosting tradeoffs, security, and cost controls.</li>
                  <li>Direct links to new field notes, docs, and product updates from My Clawster.</li>
                </ul>
                <p>
                  Prefer a pull-based workflow? <Link href={social.rss}>Subscribe by RSS</Link> or
                  go back to the <Link to="/">latest field notes</Link>.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
    </Layout>
  );
}
