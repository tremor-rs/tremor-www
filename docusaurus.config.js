const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  customFields: {
    bench_url: "https://tremor.licenser.net/bench",
  },
  plugins: [
    require.resolve('@cmfcmf/docusaurus-search-local'),
    require.resolve('docusaurus-plugin-redoc'),
    [
      '@docusaurus/plugin-content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: 'rfc',
        path: 'rfc',
        routeBasePath: 'rfc',
      },
    ],
  ],
  title: 'Tremor',
  tagline: 'An early-stage event processing system for unstructured data with rich support for structural pattern-matching, filtering and transformation.',
  url: 'https://www.tremor.rs/',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: '/favicon.ico',
  organizationName: 'tremor-rs',
  projectName: 'tremor-www',
  themeConfig: {
    navbar: {
      logo: {
        alt: 'Tremor Logo',
        src: '/img/tremor-logo.svg',
        href: 'https://www.tremor.rs/',
        target: '_self',
      },
      items: [
        { to: 'docs/next/getting-started/getting-started', label: 'Getting Started', position: 'left' },
        {
          type: 'dropdown',
          label: 'Community',
          to: 'community/community',
          position: 'left',
          items: [
            { to: 'community/community', label: 'Overview' },
            { href: 'https://chat.tremor.rs', label: 'Chat' },
            { to: 'community/governance', label: 'Governance' },
            { to: 'community/faqs', label: 'FAQs' },
            { to: 'rfc/index', label: 'RFCs' },
            { to: 'community/EventsAndMedia', label: 'Events and Media' },
            { to: 'community/case-studies', label: 'Case Studies' },
          ],
        },
        {
          type: 'doc',
          docId: 'index',
          label: 'Docs',
          position: 'left',
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          type: 'docsVersionDropdown',
          position: 'left',
        },
        {
          href: 'https://chat.tremor.rs',
          className: 'header-discord-link',
          position: 'right',
          'aria-label': 'Community Chat',
        },
        {
          href: 'https://github.com/tremor-rs',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
          position: 'right',
        },
        // {
        //   type: 'localeDropdown',
        //   position: 'right',
        // },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    footer: {
      logo: {
        alt: 'Tremor Logo',
        src: '/favicon.ico',
      },
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Quick Start',
              to: 'quick-start/',
            },
            {
              label: 'FAQs',
              to: 'community/faqs',
            },
            {
              label: 'Tremor API',
              to: 'api/0',
            },
            {
              label: 'Code of Conduct',
              to: 'community/governance/CodeofConduct',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://chat.tremor.rs/',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/TremorDEBS',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/tremor-rs',
            },
            {
              label: 'Download',
              href: 'https://github.com/tremor-rs/tremor-runtime/releases',
            },
            {
              html: '<a href="https://www.cncf.io/" rel="noreferrer noopener" aria-label="CNCF"><img src="/img/cncf-color.svg" alt="CNCF" style="width: 70%;" /></a>',
            },
            {
              html: '<a href="https://www.netlify.com" rel="noreferrer noopener" aria-label="Netlify"><img src="/img/netlify-full-logo.svg" alt="Deploys by Netlify" style="width: 40%;" /></a>',
            },
          ],
        },
      ],
      copyright: `
        <br />
        <strong> © Tremor Authors ${new Date().getFullYear()} | Documentation Distributed under CC-BY-4.0 </strong>
        <br />
        <br />
        © ${new Date().getFullYear()} The Linux Foundation. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our <a href="https://www.linuxfoundation.org/trademark-usage/"> Trademark Usage</a> page.
      `,
    },

    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/tremor-rs/tremor-www/tree/main',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/tremor-rs/tremor-www/tree/main',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            spec: 'openapi.yaml',
          },
        ],
      },
    ],
  ],
};
