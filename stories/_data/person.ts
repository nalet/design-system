// the person the avatar and user menu stories show, and a picture of them
// that is wider than it is high, so the avatar has something to crop.
export const PERSON = { name: 'Ada Urban', email: 'ada.urban@example.org' };

const picture = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
<rect width="300" height="200" fill="#15202E"/>
<rect width="300" height="64" fill="#3F6697"/>
<circle cx="150" cy="84" r="38" fill="#C9D1D9"/>
<path d="M70 200 C70 150 110 130 150 130 C190 130 230 150 230 200 Z" fill="#AEB8C2"/>
</svg>`;

export const PICTURE = `data:image/svg+xml,${encodeURIComponent(picture)}`;
