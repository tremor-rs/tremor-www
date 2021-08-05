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
  organizationName: 'tremor-rs', // Usually your GitHub org/user name.
  projectName: 'tremor-new-website', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Tremor',
      logo: {
        alt: 'Tremor Logo',
        src: 'https://www.tremor.rs/img/common/logo.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'index',
          position: 'left',
          label: 'Getting Started',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
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
          title: 'Blog',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/tremor-rs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tremor.`,
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
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
