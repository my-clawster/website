import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import type {Props} from '@theme/BlogPostItem/Container';

export default function BlogPostItemContainer({
  children,
  className,
}: Props): ReactNode {
  const {isBlogPostPage} = useBlogPost();

  return (
    <article
      className={clsx(className, {
        'lr-post-card': !isBlogPostPage,
        'lr-post-article': isBlogPostPage,
      })}>
      {children}
    </article>
  );
}
