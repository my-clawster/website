import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';
import BlogPostItemHeader from '@theme/BlogPostItem/Header';
import type {Props} from '@theme/BlogPostItem';

function useContainerClassName() {
  const {isBlogPostPage} = useBlogPost();
  return !isBlogPostPage ? 'margin-bottom--xl' : undefined;
}

export default function BlogPostItem({children, className}: Props): ReactNode {
  const {isBlogPostPage} = useBlogPost();
  const containerClassName = useContainerClassName();

  return (
    <BlogPostItemContainer className={clsx(containerClassName, className)}>
      <BlogPostItemHeader />
      {isBlogPostPage ? <BlogPostItemContent>{children}</BlogPostItemContent> : null}
      <BlogPostItemFooter />
    </BlogPostItemContainer>
  );
}
