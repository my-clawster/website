import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import NewsletterPanel from '@site/src/components/NewsletterPanel';
import Reveal from '@site/src/components/Reveal';
import {useSiteData} from '@site/src/components/site';

export default function SubscribePage() {
  const {brand, social} = useSiteData();

  return (
    <Layout
      title="Newsletter"
      description="Subscribe to La Rebelion Labs for practical essays on AI, DevOps, cloud-native architecture, and systems thinking.">
      <main className="lr-subscribe-page">
        <div className="lr-site-shell">
          <Reveal className="lr-subscribe-hero">
            <span className="lr-eyebrow">Newsletter</span>
            <h1>Follow the field notes, not the noise.</h1>
            <p>
              {brand.summary} New essays land here first, then travel to the inbox for
              readers who want the deeper thread.
            </p>
          </Reveal>
          <div className="lr-subscribe-grid">
            <NewsletterPanel variant="surface" />
            <Reveal className="lr-subscribe-notes" delay={120}>
              <div className="lr-surface-card">
                <span className="lr-eyebrow">What you get</span>
                <ul className="lr-bullet-list">
                  <li>Hands-on posts about AI tooling, MCP, DevOps, and cloud-native workflows.</li>
                  <li>Opinionated breakdowns of systems, products, and engineering tradeoffs.</li>
                  <li>Direct links to new articles, videos, and experiments from La Rebelion Labs.</li>
                </ul>
                <p>
                  Prefer a pull-based workflow? <Link href={social.rss}>Subscribe by RSS</Link> or
                  go back to the <Link to="/">latest writing</Link>.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
    </Layout>
  );
}
