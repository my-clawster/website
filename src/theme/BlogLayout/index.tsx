import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import type {Props} from '@theme/BlogLayout';

export default function BlogLayout(props: Props): ReactNode {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = Boolean(sidebar?.items.length);

  return (
    <Layout {...layoutProps} wrapperClassName={clsx('lr-layout', layoutProps.wrapperClassName)}>
      <div className="lr-site-shell">
        <div
          className={clsx('lr-site-grid', {
            'lr-site-grid--with-sidebar': hasSidebar,
            'lr-site-grid--with-toc': Boolean(toc),
          })}>
          {hasSidebar ? (
            <aside className="lr-site-rail">
              <BlogSidebar sidebar={sidebar} />
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
