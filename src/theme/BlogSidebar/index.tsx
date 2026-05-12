import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {groupBlogSidebarItemsByYear} from '@docusaurus/plugin-content-blog/client';
import {useWindowSize} from '@docusaurus/theme-common';
import type {Props} from '@theme/BlogSidebar';
import NewsletterPanel from '@site/src/components/NewsletterPanel';
import {useSiteData} from '@site/src/components/site';

type BlogSidebarProps = Props & {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export default function BlogSidebar({
  sidebar,
  collapsed = false,
  onToggleCollapse,
}: BlogSidebarProps) {
  const {social} = useSiteData();
  const windowSize = useWindowSize();

  if (!sidebar?.items.length) {
    return null;
  }

  const groups = groupBlogSidebarItemsByYear(sidebar.items);

  const archiveList = (
    <div className="lr-sidebar-stack">
      <div className="lr-surface-card">
        <span className="lr-eyebrow">[ARCHIVE]</span>
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
        <span className="lr-eyebrow">[FEEDS]</span>
          <ul>
            <li>
            <Link href={social.rss}>RSS feed</Link>
            </li>
            <li>
            <Link to="/subscribe">Updates</Link>
            </li>
             <li>
            <Link to="/archive">Browse archive</Link>
            </li>
          </ul>
      </div>
      <NewsletterPanel variant="compact" />
    </div>
  );

  if (windowSize === 'mobile') {
    return (
      <details className="lr-mobile-sidebar">
        <summary>Archive, feeds, and updates</summary>
        {archiveList}
      </details>
    );
  }

  return (
    <div className={clsx('lr-sidebar-shell', {'lr-sidebar-shell--collapsed': collapsed})}>
      <button
        type="button"
        className="lr-sidebar-toggle"
        onClick={onToggleCollapse}
        aria-expanded={!collapsed}
        aria-controls="lr-sidebar-panel">
        <span className="lr-sidebar-toggle__icon" aria-hidden="true">
          {collapsed ? '»' : '«'}
        </span>
        <span className="lr-sidebar-toggle__label">
          {collapsed ? 'Expand panel' : 'Collapse panel'}
        </span>
      </button>
      {!collapsed ? <div id="lr-sidebar-panel">{archiveList}</div> : null}
    </div>
  );
}
