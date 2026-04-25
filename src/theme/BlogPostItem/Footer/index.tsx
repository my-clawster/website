import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import {ArrowTipIcon} from '@site/src/components/icons';

export default function BlogPostItemFooter() {
  const {metadata, isBlogPostPage} = useBlogPost();
  const tags = metadata.tags.slice(0, isBlogPostPage ? metadata.tags.length : 3);

  if (!isBlogPostPage) {
    return (
      <footer className="lr-card-footer">
        <div className="lr-tag-row">
          {tags.map((tag) => (
            <Link key={tag.permalink} className="lr-tag-pill" to={tag.permalink}>
              {tag.label}
            </Link>
          ))}
        </div>
        <Link className="lr-read-more" to={metadata.permalink}>
          <span>Open article</span>
          <ArrowTipIcon width={16} height={16} />
        </Link>
      </footer>
    );
  }

  if (!tags.length) {
    return null;
  }

  return (
    <footer className="lr-post-footer">
      <div className="lr-tag-row">
        {tags.map((tag) => (
          <Link key={tag.permalink} className="lr-tag-pill" to={tag.permalink}>
            {tag.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
