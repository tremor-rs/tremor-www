const visit = require('unist-util-visit');
const gitUrl = 'https://github.com/tremor-rs/tremor-www/tree/main';

const plugin = (options) => {
    const transformer = async (ast, vfile) => {
        let number = 1;
        visit(ast, 'link', (node) => {
            if (node.url.startsWith('__GIT__')) {
                const url = vfile.path.replace(vfile.cwd, gitUrl);
                node.url = node.url.replace('__GIT__', url);
            }
        });
    };
    return transformer;
};

module.exports = plugin;