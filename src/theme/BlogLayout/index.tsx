import React, {type ReactNode, useEffect, useState} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import type {Props} from '@theme/BlogLayout';

const BLOG_SIDEBAR_STORAGE_KEY = 'clawster-website-blog-sidebar-collapsed';

export default function BlogLayout(props: Props): ReactNode {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = Boolean(sidebar?.items.length);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasLoadedSidebarState, setHasLoadedSidebarState] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = window.localStorage.getItem(BLOG_SIDEBAR_STORAGE_KEY);
      if (savedState !== null) {
        setSidebarCollapsed(savedState === 'true');
      }
    }
    setHasLoadedSidebarState(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedSidebarState || typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(
      BLOG_SIDEBAR_STORAGE_KEY,
      String(isSidebarCollapsed),
    );
  }, [hasLoadedSidebarState, isSidebarCollapsed]);

  return (
    <Layout {...layoutProps} wrapperClassName={clsx('lr-layout', layoutProps.wrapperClassName)}>
      <div className="lr-site-shell">
        <div
          className={clsx('lr-site-grid', {
            'lr-site-grid--with-sidebar': hasSidebar,
            'lr-site-grid--with-toc': Boolean(toc),
            'lr-site-grid--sidebar-collapsed': hasSidebar && isSidebarCollapsed,
          })}>
          {hasSidebar ? (
            <aside className={clsx('lr-site-rail', {'lr-site-rail--collapsed': isSidebarCollapsed})}>
              <BlogSidebar
                sidebar={sidebar}
                collapsed={isSidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
              />
            </aside>
          ) : null}
          <main className="lr-site-main">{children}</main>
          {toc ? (
            <aside className="lr-site-toc">
              <div className="lr-surface-card lr-surface-card--toc">
                <span className="lr-eyebrow">On this page</span>
                {toc}
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
