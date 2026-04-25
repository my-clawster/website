import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import NewsletterForm from '@site/src/components/NewsletterForm';
import Reveal from '@site/src/components/Reveal';
import {useSiteData} from '@site/src/components/site';

type NewsletterPanelProps = {
  variant?: 'surface' | 'postscript' | 'compact';
  className?: string;
};

export default function NewsletterPanel({
  variant = 'surface',
  className,
}: NewsletterPanelProps): ReactNode {
  const {newsletter, social} = useSiteData();
  const compact = variant === 'compact';

  return (
    <Reveal
      className={['lr-newsletter', `lr-newsletter--${variant}`, className]
        .filter(Boolean)
        .join(' ')}>
      <div className="lr-newsletter__copy">
        <span className="lr-eyebrow">Newsletter</span>
        {!compact ? (
          <>
            <h2>{newsletter.title}</h2>
            <p>{newsletter.description}</p>
          </>
        ) : null}
      </div>
      <div className="lr-newsletter__form">
        <NewsletterForm compact={compact} />
        {compact ? (
          <p className="lr-newsletter-note">
            Or skip the inbox and <Link href={social.rss}>follow the RSS feed</Link>.
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
