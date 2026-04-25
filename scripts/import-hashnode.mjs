import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const siteRoot = path.resolve(new URL('..', import.meta.url).pathname);
const sourceRoot = path.resolve(siteRoot, '../../lr-website/lr-hashnode');
const blogRoot = path.join(siteRoot, 'blog');
const postsRoot = path.join(blogRoot, 'posts');

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function parseFrontMatter(source) {
  if (!source.startsWith('---\n')) {
    return {data: {}, content: source};
  }

  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return {data: {}, content: source};
  }

  return {
    data: yaml.load(match[1]) ?? {},
    content: source.slice(match[0].length),
  };
}

function decodeCuidTimestamp(cuid) {
  return new Date(Number.parseInt(cuid.slice(1, 9), 36));
}

function extractTitle(body) {
  const h1 = body.match(/^#\s+(.+)$/m);
  if (h1) {
    return h1[1].trim();
  }

  const h2 = body.match(/^##\s+(.+)$/m);
  if (h2) {
    return h2[1].trim();
  }

  return 'Untitled';
}

function stripLeadingHeading(body) {
  return body.replace(/^#\s+.+\n+/, '');
}

function extractDescription(body) {
  const cleaned = body
    .replace(/```[\s\S]*?```/g, '')
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .find(
      (section) =>
        section &&
        !section.startsWith('#') &&
        !section.startsWith('![') &&
        !section.startsWith('<') &&
        !section.startsWith('>'),
    );

  if (!cleaned) {
    return '';
  }

  return cleaned
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

function transformInternalLinks(body, knownPaths) {
  return body.replace(
    /https?:\/\/(?:www\.)?rebelion\.la\/([a-z0-9-/]+)(?=[)#?\s]|$)/gi,
    (fullMatch, candidate) => {
      const normalized = candidate.replace(/\/+$/, '');
      return knownPaths.has(normalized) ? `/${normalized}` : fullMatch;
    },
  );
}

function transformCallouts(body) {
  return body.replace(
    /<div data-node-type="callout">\s*<div data-node-type="callout-emoji">([\s\S]*?)<\/div>\s*<div data-node-type="callout-text">([\s\S]*?)<\/div>\s*<\/div>/gi,
    (_, emoji, content) =>
      `\n:::note ${emoji.trim()} Insight\n${content.trim()}\n:::\n`,
  );
}

function transformEmbeds(body) {
  return body
    .replace(
      /<div[^>]*>\s*<iframe[^>]*src="([^"]+)"[\s\S]*?<\/div>/gi,
      (_, url) => `\n<MediaEmbed url="${url.trim()}" />\n`,
    )
    .replace(
      /<iframe[^>]*src="([^"]+)"[\s\S]*?<\/iframe>(?:<p>[\s\S]*?<\/p>)?/gi,
      (_, url) => `\n<MediaEmbed url="${url.trim()}" />\n`,
    )
    .replace(
      /^%\[(https?:\/\/[^\]]+)\]\s*$/gim,
      (_, url) => `\n<MediaEmbed url="${url.trim()}" />\n`,
    );
}

function transformDangerousHeadings(body) {
  return body.replace(
    /^(##\s+)\{\{([^}]+)\}\}$/gm,
    (_, prefix, inner) => `${prefix}\`{{${inner.trim()}}}\``,
  );
}

function normalizeImages(body) {
  return body.replace(/\s+align="[^"]+"(?=\))/g, '');
}

function normalizeRawHtmlAttributes(body) {
  return body.replace(/\sstyle="[^"]*"/g, '');
}

function normalizeEmptyLinks(body) {
  return body.replace(/\[([^\]]+)\]\(\)/g, '$1');
}

function normalizeBody(body, knownPaths) {
  return normalizeEmptyLinks(
    transformDangerousHeadings(
      transformInternalLinks(
        normalizeRawHtmlAttributes(
          normalizeImages(transformEmbeds(transformCallouts(body))),
        ),
        knownPaths,
      ),
    ),
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function main() {
  const sourceEntries = (await fs.readdir(sourceRoot))
    .filter((fileName) => fileName.endsWith('.md'))
    .sort();

  const collected = [];

  for (const fileName of sourceEntries) {
    const filePath = path.join(sourceRoot, fileName);
    const raw = await fs.readFile(filePath, 'utf8');
    const {data, content} = parseFrontMatter(raw.replace(/\r\n/g, '\n'));
    const title = String(data.title || extractTitle(content)).trim();
    const slug = String(data.slug || slugify(title));
    const date = data.datePublished
      ? new Date(String(data.datePublished))
      : decodeCuidTimestamp(path.basename(fileName, '.md'));
    const tags = String(data.tags || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const strippedBody = stripLeadingHeading(content);

    collected.push({
      title,
      slug,
      date,
      image: data.cover ? String(data.cover).trim() : undefined,
      keywords: tags,
      description: extractDescription(strippedBody),
      body: strippedBody,
    });
  }

  const knownPaths = new Set(
    collected.map((post) => post.slug).concat(['archive', 'subscribe', 'tags']),
  );

  await fs.rm(blogRoot, {recursive: true, force: true});
  await fs.mkdir(postsRoot, {recursive: true});
  await fs.writeFile(
    path.join(blogRoot, 'authors.yml'),
    `adrianescutia:
  name: Adrian Escutia
  title: Founder, La Rebelion Labs
  url: https://www.linkedin.com/in/adrianescutia/
  image_url: /img/brand/logo-mark.png
  page:
    permalink: /authors/adrian-escutia
  socials:
    github: https://github.com/la-rebelion
    linkedin: https://www.linkedin.com/in/adrianescutia/
    x: https://twitter.com/LaRebelionLabs
    youtube: https://www.youtube.com/@LaRebelion
`,
  );

  for (const post of collected) {
    const frontMatter = {
      title: post.title,
      description: post.description,
      date: post.date.toISOString(),
      slug: post.slug,
      authors: ['adrianescutia'],
      tags: post.keywords,
      image: post.image,
    };

    if (post.keywords.length) {
      frontMatter.keywords = post.keywords;
    }

    const serializedFrontMatter = yaml.dump(frontMatter, {
      lineWidth: 1000,
      noRefs: true,
    });

    const normalizedBody = normalizeBody(post.body, knownPaths);
    const outputPath = path.join(
      postsRoot,
      `${post.date.toISOString().slice(0, 10)}-${post.slug}.mdx`,
    );

    await fs.writeFile(
      outputPath,
      `---\n${serializedFrontMatter}---\n\n${normalizedBody}\n`,
    );
  }

  console.log(`Imported ${collected.length} posts into ${postsRoot}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
