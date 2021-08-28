const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Tremor',
  tagline: 'An early-stage event processing system for unstructured data with rich support for structural pattern-matching, filtering and transformation.',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'docs/favicon.ico',
  organizationName: 'tremor-rs', 
  projectName: 'tremor-new-website', 
  themeConfig: {
    navbar: {
      logo: {
        alt: 'Tremor Logo',
        src: 'https://www.tremor.rs/img/common/logo.png',
        href: 'https://your-docusaurus-test-site.com',
        target: '_self',
      },
      items: [
        { to: 'getting-started/',
          label: 'Getting Started',
          position: 'left',
    	},
          {
	          type: 'doc',
            docId: 'index',
            label: 'Docs',
            position: 'left',
          },
	       {to: 'blog', label: 'Blog', position: 'left'},
         {to: 'workshop', label: 'Usage Guide', position: 'left'},
         {to: 'api', label: 'API', position: 'left'},
	       {to: 'rfcs', label: 'RFCs', position: 'left'},
	       {to: 'community', label: 'Community', position: 'left'},
	       {to: 'governance', label: 'Governance', position: 'left'},
         {to: 'faqs', label: 'FAQs', position: 'left' },
        {
          href: 'https://github.com/tremor-rs',
          label: 'GitHub',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub',
        },
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownItemsAfter: [{to: 'docs/', label: 'All versions'}],
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
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
              label: 'CNCF',
              href: 'https://www.cncf.io/',
            }
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
            'https://github.com/skoech/tremor-new-website/tree/main/docs',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/skoech/tremor-new-website/tree/main/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
