// facts every page shares. the version is read from package.json, so the
// install line and the footer follow a release without an edit here.
import pkg from '../../../package.json';

/** the site's base path, with its trailing slash: "/design-system/". */
export const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

/** a path inside the guidelines site: url('styles/colour/') -> "/design-system/styles/colour/". */
export const url = (path = '') => `${BASE}${path.replace(/^\//, '')}`;

/** the react subsite (the storybook). */
export const REACT = url('react/');

/** a page of the react subsite by its storybook id: reactDocs('components-actions-button'). */
export const reactDocs = (id: string) => `${REACT}?path=/docs/${id}--docs`;

export const REPO = 'https://github.com/nalet/design-system';
export const VERSION: string = pkg.version;
export const INSTALL = `npm i ${REPO}/releases/download/v${VERSION}/nalet-design-system-${VERSION}.tgz`;
