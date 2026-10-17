// /design-system/iframe.html: a story's canvas, embedded elsewhere, from the
// time the storybook was the whole site. it moves on to the same story on the
// react subsite, or to the page its content moved to. see site/redirects.mjs.
import { redirectScript } from '../../redirects.mjs';
import { url } from '../data/site';

export function GET() {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script>${redirectScript(url())}</script>
    <meta name="robots" content="noindex" />
    <title>moved · nalet design system</title>
  </head>
  <body>
    <p>The React examples moved to <a href="${url('react/')}">${url('react/')}</a>.</p>
  </body>
</html>
`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
