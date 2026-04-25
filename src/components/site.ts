import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type BrandConfig = {
  phrase: string;
  summary: string;
  foundedYear: number;
};

type NewsletterConfig = {
  subscribeUrl: string;
  emailParam: string;
  title: string;
  description: string;
  cooldownDays: number;
};

type SocialConfig = {
  rss: string;
  github: string;
  linkedin: string;
  x: string;
  youtube: string;
};

export type SiteData = {
  brand: BrandConfig;
  newsletter: NewsletterConfig;
  social: SocialConfig;
};

const defaults: SiteData = {
  brand: {
    phrase: 'Question defaults. Explore everything. Create what’s next.',
    summary:
      'A content-first field guide for AI systems, DevOps, cloud-native architecture, and product-minded engineering.',
    foundedYear: 2022,
  },
  newsletter: {
    subscribeUrl: 'https://go.rebelion.la/subscribe',
    emailParam: 'email',
    title: 'Stay close to the experiments',
    description:
      'Get new essays, practical guides, and hands-on field notes from La Rebelion Labs.',
    cooldownDays: 14,
  },
  social: {
    rss: 'https://rebelion.la/rss.xml',
    github: 'https://github.com/la-rebelion',
    linkedin: 'https://www.linkedin.com/in/adrianescutia/',
    x: 'https://twitter.com/LaRebelionLabs',
    youtube: 'https://www.youtube.com/@LaRebelion',
  },
};

export function useSiteData(): SiteData {
  const {siteConfig} = useDocusaurusContext();
  const customFields = (siteConfig.customFields ?? {}) as Partial<SiteData>;

  return {
    brand: {
      ...defaults.brand,
      ...customFields.brand,
    },
    newsletter: {
      ...defaults.newsletter,
      ...customFields.newsletter,
    },
    social: {
      ...defaults.social,
      ...customFields.social,
    },
  };
}
