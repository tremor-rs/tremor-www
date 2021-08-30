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
         {to: 'quick-start', label: 'Usage Guide', position: 'left'},
         {to: 'api', label: 'API', position: 'left'},
	       {to: 'rfcs', label: 'RFCs', position: 'left', docId: 'rfc'},
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
      	{
	        type: 'search',
	        position: 'right',
      	},
      ],
    },
    footer: {
      logo: {
	alt: 'Tremor Logo',
	src: 'static/favicon.ico',
      },
      style: 'dark',
      links: [
	   {
	     title:'Docs',
	     items: [
	       {
		 label: 'Docs',
		 to: 'docs/',
	       },
	       {
	         label: 'Usage Guide',
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
              label: 'The Team',
              href: 'community/teams.md/',
            },
            {
              html: `<a href="https://www.cncf.io/" target="_blank" rel="noreferrer noopener" aria-label="CNCF"><img src="static/img/cncf-color-minimalism.png" alt="CNCF" /></a>`,
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
