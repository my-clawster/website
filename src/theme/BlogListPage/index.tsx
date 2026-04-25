import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import type {Props} from '@theme/BlogListPage';
import NewsletterPanel from '@site/src/components/NewsletterPanel';
import Reveal from '@site/src/components/Reveal';
import {ArrowTipIcon} from '@site/src/components/icons';
import {useSiteData} from '@site/src/components/site';

function BlogListPageMetadata(props: Props): ReactNode {
  const {metadata} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;

  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function getTopTags(props: Props) {
  const byTag = new Map<string, {label: string; permalink: string; count: number}>();

  props.items.forEach(({content}) => {
    content.metadata.tags.forEach((tag) => {
      const current = byTag.get(tag.permalink);
      byTag.set(tag.permalink, {
        label: tag.label,
        permalink: tag.permalink,
        count: (current?.count ?? 0) + 1,
      });
    });
  });

  return [...byTag.values()].sort((left, right) => right.count - left.count).slice(0, 6);
}

function BlogListPageContent(props: Props): ReactNode {
  const {metadata, items, sidebar} = props;
  const {brand} = useSiteData();
  const latestPost = items[0]?.content;
  const topTags = getTopTags(props);
  const yearsOfWriting = new Date().getFullYear() - brand.foundedYear + 1;

  return (
    <BlogLayout sidebar={sidebar}>
      <div className="lr-home">
        <section className="lr-home-hero">
          <Reveal className="lr-home-hero__copy">
            <span className="lr-eyebrow">La Rebelion Labs</span>
            <h1>Sharp writing for builders who refuse default paths.</h1>
            <p>{brand.summary}</p>
            <div className="lr-hero-actions">
              {latestPost ? (
                <Link className="lr-button lr-button--primary" to={latestPost.metadata.permalink}>
                  <span>Read latest</span>
                  <ArrowTipIcon width={16} height={16} />
                </Link>
              ) : null}
              <Link className="lr-button" to="/archive">
                Browse archive
              </Link>
            </div>
            <div className="lr-stat-row">
              <div className="lr-stat-card">
                <strong>{metadata.totalCount}</strong>
                <span>Articles published</span>
              </div>
              <div className="lr-stat-card">
                <strong>{yearsOfWriting}</strong>
                <span>Years of writing</span>
              </div>
              <div className="lr-stat-card">
                <strong>{topTags.length}</strong>
                <span>Core topic lanes</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="lr-home-hero__stage" delay={120}>
            <div className="lr-signal-card">
              <div className="lr-signal-card__grid" />
              <img className="lr-signal-card__mark" src="/img/brand/la-rebelion-dynamic.png" alt="La Rebelion Logo Dynamic" />
              {latestPost ? (
                <div className="lr-signal-card__preview">
                  <span className="lr-eyebrow">Latest dispatch</span>
                  <Link to={latestPost.metadata.permalink}>{latestPost.metadata.title}</Link>
                  <p>{latestPost.metadata.description}</p>
                </div>
              ) : null}
            </div>
          </Reveal>
        </section>

        <section id="latest" className="lr-section">
          <Reveal className="lr-section-heading">
            <div>
              <span className="lr-eyebrow">Latest</span>
              <h2>New essays and field notes</h2>
            </div>
            <p>
              Root-routed permalinks, long-form writing, and practical guides tuned for readers
              who want the details without the clutter.
            </p>
          </Reveal>
          {topTags.length ? (
            <div className="lr-topic-strip">
              {topTags.map((tag) => (
                <Link key={tag.permalink} className="lr-topic-chip" to={tag.permalink}>
                  {tag.label}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="lr-post-grid">
            <BlogPostItems items={items} />
          </div>
        </section>

        <NewsletterPanel />
        <BlogListPaginator metadata={metadata} />
      </div>
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={[
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      ].join(' ')}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
