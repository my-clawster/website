import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Hubspot account id
const hubspot = {
  accountId: '21339207',
};

const config: Config = {
  title: 'My Clawster',
  tagline: 'Self-hostable cluster management for managed agent infrastructure.',
  favicon: 'img/brand/my-clawster.png',

  future: {
    v4: true,
  },

  url: 'https://clawster.my',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'my-clawster',
  projectName: 'website',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs:  {
          routeBasePath: '/docs',
        },
        blog: {
          routeBasePath: '/',
          archiveBasePath: 'archive',
          tagsBasePath: 'tags',
          authorsMapPath: 'authors.yml',
          blogTitle: 'My Clawster',
          blogDescription:
            'Self-hostable managed agents infrastructure for teams running OpenClaw, Hermes, and custom agent frameworks across isolated workspaces.',
          postsPerPage: 9,
          blogSidebarTitle: 'Archive',
          blogSidebarCount: 'ALL',
          showReadingTime: true,
          feedOptions: {
            type: ['rss'],
            xslt: true,
            async createFeedItems({blogPosts, defaultCreateFeedItems, ...params}) {
              const validPosts = blogPosts.filter(
                (post) => !Number.isNaN(new Date(post.metadata.date).getTime()),
              );

              return defaultCreateFeedItems({
                ...params,
                blogPosts: validPosts,
              });
            },
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-DFPWK4QZH9',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item) => !item.url.includes('/page/'));
          },
        },
      } satisfies Preset.Options,
    ],
  ],
  // to ignore webpack warnings from dependencies that we don't control and that are not ESM‑compliant (e.g. vscode-languageserver-types)
  plugins: [
    function suppressThirdPartyWebpackWarnings() {
      return {
        name: 'suppress-third-party-webpack-warnings',
        configureWebpack() {
          return {
            ignoreWarnings: [
              {
                module: /vscode-languageserver-types[\\/]lib[\\/]umd[\\/]main\.js$/,
                message:
                  /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
              },
            ],
          };
        },
      };
    },
  ],

  themeConfig: {
    image: 'img/brand/clawsters-overview.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    blog: {
      sidebar: {
        groupByYear: true,
      },
    },
    navbar: {
      title: 'My Clawster',
      logo: {
        alt: 'My Clawster',
        src: 'img/brand/my-clawster.png',
        srcDark: 'img/brand/my-clawster.png',
      },
      items: [
        {type: 'doc', docId: 'my-clawster/index', label: 'My Clawster', position: 'left'},
        {type: 'doc', docId: 'clawne-me/index', label: 'Clawne Me', position: 'left'},
        {type: 'doc', docId: 'enterprise/index', label: 'Enterprise', position: 'left'},
        {to: '/', label: 'Blog', position: 'left'},
        {to: '/archive', label: 'Archive', position: 'left'},
        {to: '/subscribe', label: 'Updates', position: 'right'},
        { href: 'https://clawne.me', label: 'Clawne Me', position: 'right' },
        {
          href: 'https://github.com/la-rebelion',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    metadata: [
      {name: 'theme-color', content: '#08080d'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    /** Algolia search configuration (if needed)
    algolia: {
      // The application ID provided by Algolia
      appId: 'IWEZFBB82X',
      // Public API key: it is safe to commit it
      apiKey: '19cbd092be35d848a2645241f4538018',
      indexName: 'REPLACE_WITH_YOUR_INDEX_NAME',
      // Optional: see doc section below
      contextualSearch: true,
      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: 'clawster\\.my|mcp\\.com\\.ai',
      // Optional: Algolia search parameters
      searchParameters: {},
      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',
      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,
      // Optional: whether you want to use the new Ask AI feature (undefined by default)
      askAi: 'YOUR_ALGOLIA_ASK_AI_ASSISTANT_ID',
      //... other Algolia params
    },
      */
  } satisfies Preset.ThemeConfig,
  scripts: [
    {
      src: 'https://js.hsforms.net/forms/embed/v2.js',
      async: true,
    },
  ],
  headTags: [
    {
      tagName: 'script',
      attributes: {
        async: "true",
        defer: "true",
        type: 'text/javascript',
        id: 'hs-script-loader',
        src: `//js.hs-scripts.com/${hubspot.accountId}.js`,
      },
    },
  ],
  themes: ['@docusaurus/theme-mermaid'],

  customFields: {
    clawster: {
      controlPlane: 'https://claws.clawster.my',
      description:
        'My Clawster is a self-hostable cluster management platform for teams running OpenClaw, Hermes, and custom agent frameworks across isolated workspaces.',
    },
    brand: {
      phrase: 'Run the agents. Keep the keys. Own the cluster.',
      summary:
        'Self-hostable cluster management for teams running OpenClaw, Hermes, and custom agent frameworks across isolated workspaces.',
      foundedYear: 2021,
    },
    clawne: {
      description:
        'With Clawne Me, clone yourself as an agent on My Clawster to automate tasks and projects. Choose your personality, your clone learn from interactions, and extend with custom skills.',
    },
    newsletter: {
      subscribeUrl: '/subscribe',
      emailParam: 'email',
      title: 'Stay close to the cluster',
      description:
        'Get release notes, architecture guides, and field-tested patterns for self-hosted agent infrastructure.',
      cooldownDays: 14,
    },
    social: {
      rss: 'https://clawster.my/rss.xml',
      github: 'https://github.com/la-rebelion',
      linkedin: 'https://www.linkedin.com/in/adrianescutia/',
      x: 'https://twitter.com/LaRebelionLabs',
      youtube: 'https://www.youtube.com/@LaRebelion',
    },
    docs: {
      labels: {
        oss: 'OSS',
        community: 'Community',
        enterprise: 'Enterprise',
      },
    },
  },
};

export default config;
