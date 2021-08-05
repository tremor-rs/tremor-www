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
      },
      items: [
          {
            href: 'https://www.tremor.rs/getting-started/starting/',
            label: 'Getting Started',
            position: 'left',
          },
     /*   {
          type: 'doc',
          docId: 'index',
          position: 'left',
          label: 'Getting Started', */
        {to: 'docs', label: 'Docs', position: 'left'},
        {to: 'blog', label: 'Blog', position: 'left'},
        {to: 'workshop', label: 'Usage Guide', position: 'left'},
        {to: 'api', label: 'API', position: 'left'},
        {
          href: 'https://www.tremor.rs/faq/',
          label: 'FAQs',
          position: 'right',
        },
        {
          href: 'https://github.com/tremor-rs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/index',
            },
	          {
	            label: 'Tremor API',
	            to: 'docs/api.md',
	          },
	          {
		          label: 'Governance',
		          to: 'docs/Governance.md',
	          },
	          {
		          label: 'Overview',
	          	to: 'docs/overview.md',
	          }, 
              ],
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
