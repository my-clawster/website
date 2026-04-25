import Link from '@docusaurus/Link';
import {groupBlogSidebarItemsByYear} from '@docusaurus/plugin-content-blog/client';
import {useWindowSize} from '@docusaurus/theme-common';
import type {Props} from '@theme/BlogSidebar';
import NewsletterPanel from '@site/src/components/NewsletterPanel';
import {useSiteData} from '@site/src/components/site';

export default function BlogSidebar({sidebar}: Props) {
  const {social} = useSiteData();
  const windowSize = useWindowSize();

  if (!sidebar?.items.length) {
    return null;
  }

  const groups = groupBlogSidebarItemsByYear(sidebar.items);

  const archiveList = (
    <div className="lr-sidebar-stack">
      <div className="lr-surface-card">
        <span className="lr-eyebrow">Archive</span>
        <div className="lr-archive-group-list">
          {groups.map(([year, items]) => (
            <section key={year} className="lr-archive-group">
              <h3>{year}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item.permalink}>
                    <Link to={item.permalink}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <div className="lr-surface-card lr-sidebar-links">
        <span className="lr-eyebrow">Feeds</span>        
          <ul>
            <li>
            <Link href={social.rss}>RSS feed</Link>
            </li>
            <li>
            <Link to="/subscribe">Newsletter</Link>
            </li>
             <li>
            <Link to="/tags">Browse topics</Link>
            </li>
          </ul>
      </div>
      <NewsletterPanel variant="compact" />
    </div>
  );

  if (windowSize === 'mobile') {
    return (
      <details className="lr-mobile-sidebar">
        <summary>Archive, feeds, and newsletter</summary>
        {archiveList}
      </details>
    );
  }

  return archiveList;
}
