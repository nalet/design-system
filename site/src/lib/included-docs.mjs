// the changelog is rendered inside the versioning page, under that page's own
// h1, so every heading of CHANGELOG.md moves down one level there. the heading
// list a page gets from the file (getHeadings) already has the new levels.
const INCLUDED = ['/CHANGELOG.md'];
const NEXT = { h1: 'h2', h2: 'h3', h3: 'h4', h4: 'h5', h5: 'h6' };

export const demoteIncludedHeadings = {
  name: 'nalet-demote-included-headings',
  element: {
    filter: Object.keys(NEXT),
    visit(node, ctx) {
      const file = ctx.fileURL?.pathname ?? '';
      if (!INCLUDED.some((name) => file.endsWith(name))) return;
      ctx.replaceNode(node, { ...node, tagName: NEXT[node.tagName] });
    },
  },
};
