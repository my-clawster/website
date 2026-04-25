import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export default function BlogPostItemHeader() {
  const {metadata, frontMatter, assets, isBlogPostPage} = useBlogPost();
  const coverImage =
    assets.image ?? (typeof frontMatter.image === 'string' ? frontMatter.image : undefined);
  const primaryTag = metadata.tags[0];
  const readingTime = metadata.readingTime ? Math.max(1, Math.round(metadata.readingTime)) : null;
  const author = metadata.authors[0];

  if (!isBlogPostPage) {
    return (
      <header className="lr-card-header">
        {coverImage ? (
          <Link className="lr-card-cover" to={metadata.permalink}>
            <img src={coverImage} alt="" loading="lazy" />
          </Link>
        ) : null}
        <div className="lr-card-kicker">
          {primaryTag ? <Link to={primaryTag.permalink}>{primaryTag.label}</Link> : <span>Essay</span>}
          <span>{formatDate(metadata.date)}</span>
          {readingTime ? <span>{readingTime} min</span> : null}
        </div>
        <h2 className="lr-card-title">
          <Link to={metadata.permalink}>{metadata.title}</Link>
        </h2>
        {metadata.description ? <p>{metadata.description}</p> : null}
      </header>
    );
  }

  return (
    <header className="lr-post-hero">
      <Link className="lr-back-link" to="/">
        Latest writing
      </Link>
      <div className="lr-post-kicker">
        {primaryTag ? <Link to={primaryTag.permalink}>{primaryTag.label}</Link> : <span>Essay</span>}
        <span>{formatDate(metadata.date)}</span>
        {readingTime ? <span>{readingTime} min read</span> : null}
      </div>
      <h1 className="lr-post-title">{metadata.title}</h1>
      {metadata.description ? <p className="lr-post-description">{metadata.description}</p> : null}
      {author ? (
        <div className="lr-post-byline">
          <span>{author.name}</span>
          <span>{author.title}</span>
        </div>
      ) : null}
      {coverImage ? (
        <div className="lr-post-cover">
          <img src={coverImage} alt="" />
        </div>
      ) : null}
    </header>
  );
}
