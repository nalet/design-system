// a markdown table is wrapped in a frame that scrolls sideways on a narrow
// screen. the frame becomes a focusable, named region only while it overflows
// (a small script in the page layout), the way the library's own table does.
export const wrapTables = {
  name: 'nalet-wrap-tables',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, { raw: '<div class="ds-table-frame"></div>' });
    },
  },
};
