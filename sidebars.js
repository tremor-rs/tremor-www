// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  indexSidebar: [
    {
      type: 'autogenerated',
      dirName: '.'
    },
    {
      type: "link",
      label: "Benchmarks",
      href: "/benchmarks"
    },
    {
      type: 'doc',
      label: 'Api',
      id: 'api/index'
    }
  ],
};

module.exports = sidebars;
