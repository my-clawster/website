import Link from '@docusaurus/Link';
import type {ReactNode} from 'react';
import {PlayIcon} from '@site/src/components/icons';

type MediaEmbedProps = {
  url: string;
};

function getYoutubeEmbedUrl(url: URL) {
  if (url.hostname === 'youtu.be') {
    return `https://www.youtube.com/embed/${url.pathname.replace('/', '')}`;
  }

  if (url.hostname.includes('youtube.com')) {
    if (url.pathname === '/watch') {
      return `https://www.youtube.com/embed/${url.searchParams.get('v') ?? ''}`;
    }

    if (url.pathname.startsWith('/embed/')) {
      return url.toString();
    }
  }

  return null;
}

function getEmbed(url: string): {kind: 'iframe' | 'link'; src: string} {
  try {
    const parsed = new URL(url);
    const youtubeEmbed = getYoutubeEmbedUrl(parsed);

    if (youtubeEmbed) {
      return {kind: 'iframe', src: youtubeEmbed};
    }

    if (
      parsed.hostname.includes('giphy.com') ||
      parsed.hostname.includes('youtube.com') ||
      parsed.hostname === 'youtu.be'
    ) {
      return {kind: 'iframe', src: url};
    }
  } catch {
    return {kind: 'link', src: url};
  }

  return {kind: 'link', src: url};
}

export default function MediaEmbed({url}: MediaEmbedProps): ReactNode {
  const embed = getEmbed(url);

  if (embed.kind === 'iframe') {
    return (
      <div className="lr-media-embed">
        <iframe
          src={embed.src}
          title="Embedded media"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <Link className="lr-link-card lr-link-card--media" href={url}>
      <span className="lr-link-card__eyebrow">External media</span>
      <strong>{url.replace(/^https?:\/\//, '')}</strong>
      <span className="lr-link-card__action">
        <PlayIcon width={16} height={16} />
        Open media
      </span>
    </Link>
  );
}
