// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const gitLinks = require('./src/remark/git-links');
const lightCodeTheme = require('prism-react-renderer/themes/dracula');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {

  customFields: {
    bench_url: "https://tremor.licenser.net/bench",
  },

  title: 'Tremor',
  tagline: 'An early-stage event processing system for unstructured data with rich support for structural pattern-matching, filtering and transformation.',
  url: 'https://www.tremor.rs/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'static/img/favicon.ico',
  organizationName: 'tremor-rs', // Usually your GitHub org/user name.
  projectName: 'tremor-rs/tremor-www', // Usually your repo name.
  staticDirectories: ['static'],

  //
  // Content plugins - these should *NOT* be deep linked in `/docs`
  //
  plugins: [
    require.resolve('@cmfcmf/docusaurus-search-local'),
    ['@docusaurus/plugin-content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: 'rfc',
        path: 'rfc',
        routeBasePath: 'rfc',
        editUrl: 'https://github.com/tremor-rs/tremor-www/tree/main/'
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        sidebarPath: require.resolve('./sidebarsCommunity.js'),
      },
    ],
  ]

  ,
  presets: [
    [
      'redocusaurus',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // Plugin Options for loading OpenAPI files
        specs: [
          {
            spec: 'static/api/edge/openapi.yaml',
            route: '/docs/edge/api',
          },
          {
            spec: 'static/api/v0.12/openapi.yaml',
            route: '/docs/0.12/api',
          },
        ],
        // Theme Options for modifying how redoc renders them
        theme: {
          // Change with your site colors
          primaryColor: '#1890ff',
        },
      }),
    ],
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        debug: true,
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/tremor-rs/tremor-www/tree/main/',
          remarkPlugins: [require('mdx-mermaid'), gitLinks],
          lastVersion: '0.12',
          // this will introduce a version called 'edge' but always select it
          versions: {
            'current': {
              label: 'edge',
              path: 'edge',
              badge: true,

            },
            '0.12': {
              label: '0.12',
              path: '0.12',
              badge: true,
            },
            '0.11': {
              label: '0.11',
              path: '0.11',
              badge: true,
            },
          },
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/tremor-rs/tremor-www/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },

      })
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Tremor Logo',
          src: 'img/tremor-logo.svg',
          href: 'https://www.tremor.rs/',
          target: '_self',
        },
        items: [
          {
            type: 'doc',
            docId: 'getting-started/index',
            position: 'left',
            label: 'Getting Started',
          },
          {
            type: 'dropdown',
            label: 'Community',
            to: 'community',
            position: 'left',
            items: [
              { to: 'community/CodeOfConduct', label: 'Code of Conduct' },
              { to: 'community/development', label: 'Contribute' },
              { to: 'rfc', label: 'RFCs' },
              { to: 'community/events', label: 'Events and Media' },
              { href: 'https://chat.tremor.rs', label: 'Chat' },
            ],
          },
          { to: 'blog', label: 'Blog', position: 'left' },

          {
            type: 'dropdown',
            label: 'Docs',
            positition: 'left',
            to: 'docs/0.12',
            items: [
              // We chose to reference the most recent version here
              // RELEASE: this needs to change for each major version release (0.12 -> 0.13)
              { type: 'doc', docId: 'guides/index', label: 'Guides' },
              { type: 'doc', docId: 'reference/index', label: 'Reference Documentation' },
              { type: 'doc', docId: 'api/index', label: 'API' },
            ],
          },
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
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Social',
            items: [
              {
                label: 'Discord',
                href: 'https://chat.tremor.rs/',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/TremorDEBS',
              },
            ]
          },
          {
            title: 'Media',
            items: [
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/channel/UCg1hxwEjh9szpYg8SxL0U7Q',
              },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'Code of Conduct', to: 'community/CodeofConduct' },
              { label: 'Download', href: 'https://github.com/tremor-rs/tremor-runtime/releases' },
            ],
          },
        ],
        copyright: `
          Copyright © ${new Date().getFullYear()}, Tremor Authors | Documentation Distributed under CC-BY-4.0.<br/><br>
              <p style="font-size: smaller;">Hosted by: <a href="https://www.netlify.com/" rel="noreferrer noopener" aria-label="Netlify"><img src="/img/netlify-full-logo.svg" alt="CNCF" style="width: 3%;" /></a>
              &nbsp;&nbsp;&nbsp;&nbsp;
              Project of: <a href="https://www.cncf.io/" rel="noreferrer noopener" aria-label="CNCF"><img src="/img/cncf-color.svg" alt="CNCF" style="width: 5%;" /></a></p>
        <small>© ${new Date().getFullYear()} The Linux Foundation. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our <a href="https://www.linuxfoundation.org/trademark-usage/">Trademark Usage</a> page.</small>
        `,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['tremor', 'ebnf']
      },
    }),
};

module.exports = config;
