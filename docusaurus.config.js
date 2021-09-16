const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  plugins: [
    require.resolve('@cmfcmf/docusaurus-search-local'),
    require.resolve('docusaurus-plugin-redoc')
  ],
  title: 'Tremor',
  tagline: 'An early-stage event processing system for unstructured data with rich support for structural pattern-matching, filtering and transformation.',
  url: 'https://tremor-rs.github.io/',
  baseUrl: '/tremor-new-website/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'docs/favicon.ico',
  organizationName: 'tremor-rs',
  projectName: 'tremor-new-website',
  themeConfig: {
    navbar: {
      logo: {
        alt: 'Tremor Logo',
        src: '/img/tremor-logo.png',
        href: 'https://tremor-rs.github.io/tremor-new-website/',
        target: '_self',
      },
      items: [
        {
          to: 'getting-started/about/',
          label: 'About Us',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'index',
          label: 'Docs',
          position: 'left',
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        { to: 'quick-start', label: 'Usage Guide', position: 'left' },
        {
          to: "api/0",
          activeBasePath: "api",
          label: "API",
          position: "left",
        },
        { to: 'rfcs/rfcs', label: 'RFCs', position: 'left' },
        { to: 'community/community', label: 'Community', position: 'left' },
        { to: 'governance', label: 'Governance', position: 'left' },
        { to: 'faqs', label: 'FAQs', position: 'left' },
        {
          href: 'https://github.com/tremor-rs',
          label: 'GitHub',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub',
        },
        // {
        //   type: 'docsVersionDropdown',
        //   position: 'left',
        //   dropdownItemsAfter: [{ to: 'docs/', label: 'All versions' }],
        // },
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
              to: 'faqs/',
            },
            {
              label: 'Tremor API',
              to: 'api/',
            },
            {
              label: 'Code of Conduct',
              to: 'docs/governance/CodeOfConduct/',
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
              html: `<a href="https://www.cncf.io/" target="_blank" rel="noreferrer noopener" aria-label="CNCF"><img src="cncf-color.svg" alt="CNCF" /></a>`,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tremor`,
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
            'https://github.com/tremor-rs/tremor-new-website/tree/main',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/tremor-rs/tremor-new-website/tree/main',
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
