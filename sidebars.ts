import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'index',
    {
      type: 'category',
      label: 'My Clawster',
      link: {type: 'doc', id: 'my-clawster/index'},
      items: [
        'my-clawster/quickstart',
        'my-clawster/create-your-first-clawster',
        'my-clawster/manage-clusters-and-claws',
        'my-clawster/plans-offers-and-service-options',
        'my-clawster/authentication-and-access',
        'my-clawster/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Clawne Me',
      link: {type: 'doc', id: 'clawne-me/index'},
      items: [
        'clawne-me/getting-started',
        'clawne-me/create-your-first-clawne',
        'clawne-me/personalities-memory-and-tools',
        'clawne-me/manage-your-clawne',
        'clawne-me/faq-and-troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Enterprise',
      link: {type: 'doc', id: 'enterprise/index'},
      items: [
        'enterprise/admin-portal-tour',
        'enterprise/product-to-resource',
        'enterprise/provider-management',
        'enterprise/offers-and-business-promises',
        'enterprise/integrations-audit-and-health',
      ],
    },
    {
      type: 'category',
      label: 'Developers',
      link: {type: 'doc', id: 'developers/index'},
      items: [
        'developers/local-development',
        'developers/packages-plugins-and-ui-extensions',
        'developers/provider-plugin-development',
        'developers/enterprise-extension-model',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      link: {type: 'doc', id: 'operations/index'},
      items: [
        'operations/deployment-topologies',
        'operations/cloudflare-deployment',
        'operations/environment-reference',
        'operations/bootstrap-and-recovery',
        'operations/production-checklist',
      ],
    },
  ],
};

export default sidebars;
