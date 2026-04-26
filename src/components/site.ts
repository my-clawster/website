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
  clawster: {
    controlPlane: string;
  };
  brand: BrandConfig;
  newsletter: NewsletterConfig;
  social: SocialConfig;
};

const defaults: SiteData = {
  clawster: {
    controlPlane: 'https://claws.clawster.my'
  },
  brand: {
    phrase: 'Run the agents. Keep the keys. Own the cluster.',
    summary:
      'Self-hostable cluster management for teams running OpenClaw, Hermes, and custom agent frameworks across isolated workspaces.',
    foundedYear: 2022,
  },
  newsletter: {
    subscribeUrl: 'https://go.rebelion.la/subscribe',
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
};

export function useSiteData(): SiteData {
  const {siteConfig} = useDocusaurusContext();
  const customFields = (siteConfig.customFields ?? {}) as Partial<SiteData>;

  return {
    clawster: {
      ...defaults.clawster,
      ...customFields.clawster,
    },
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
