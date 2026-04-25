import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {PageMetadata} from '@docusaurus/theme-common';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import Layout from '@theme/Layout';
import type {ArchiveBlogPost, Props} from '@theme/BlogArchivePage';
import Heading from '@theme/Heading';

type YearProp = {
  year: string;
  posts: ArchiveBlogPost[];
};

function Year({year, posts}: YearProp) {
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });

  const formatDate = (value: string | null | undefined) =>
    value ? dateTimeFormat.format(new Date(value)) : 'Undated';

  return (
    <section className="lr-surface-card lr-archive-panel">
      <Heading as="h2">{year}</Heading>
      <ul className="lr-bullet-list">
        {posts.map((post) => (
          <li key={`${year}-${post.metadata.permalink}`}>
            <Link to={post.metadata.permalink}>
              {formatDate(post.metadata.date)} · {post.metadata.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function listPostsByYears(blogPosts: readonly ArchiveBlogPost[]): YearProp[] {
  const postsByYear = blogPosts.reduce((posts, post) => {
    const year = post.metadata.date?.split('-')[0] ?? 'Undated';
    const yearPosts = posts.get(year) ?? [];
    return posts.set(year, [post, ...yearPosts]);
  }, new Map<string, ArchiveBlogPost[]>());

  return Array.from(postsByYear, ([year, posts]) => ({
    year,
    posts,
  }));
}

export default function BlogArchive({archive}: Props): ReactNode {
  const title = translate({
    id: 'theme.blog.archive.title',
    message: 'Archive',
    description: 'The page & hero title of the blog archive page',
  });
  const description = translate({
    id: 'theme.blog.archive.description',
    message: 'All essays grouped by year.',
    description: 'The page & hero description of the blog archive page',
  });
  const years = listPostsByYears(archive.blogPosts);

  return (
    <>
      <PageMetadata title={title} description={description} />
      <Layout>
        <main className="lr-subscribe-page">
          <div className="lr-site-shell">
            <header className="lr-subscribe-hero">
              <span className="lr-eyebrow">Archive</span>
              <h1>{title}</h1>
              <p>{description}</p>
            </header>
            <div className="lr-post-grid">
              {years.map((year) => (
                <Year key={year.year} {...year} />
              ))}
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
