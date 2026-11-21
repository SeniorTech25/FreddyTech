const formats = ['VHS','VHS-C','Video8','Hi8','Digital8','MiniDV','Betamax'];
const gallery = document.querySelector('#gallery');
const chosen = new Set();
function picture(format) {
  const img = new Image();
  img.src = '/memories/tapes/' + format.toLowerCase() + '.svg';
  img.alt = format + ' cassette illustration';
  img.loading = 'lazy';
  return img;
}
for (const format of formats) {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-pressed','false');
  button.setAttribute('aria-label',format);
  const label = document.createElement('strong');
  label.textContent = format;
  button.append(picture(format),label);
  button.onclick = () => {
    if (chosen.has(format)) chosen.delete(format); else chosen.add(format);
    button.setAttribute('aria-pressed',String(chosen.has(format)));
    document.querySelector('#selection').textContent = 'Formats: ' + ([...chosen].join(', ') || 'not sure yet');
  };
  gallery.append(button);
}
for (const [format,caption] of [['VHS','Full-size home-video cassette'],['VHS-C','Compact VHS camcorder cassette'],['Hi8','Look for an 8, Hi8 or Digital8 mark']]) {
  const figure = document.createElement('figure');
  const text = document.createElement('figcaption');
  text.textContent = format + ' · ' + caption;
  figure.append(picture(format),text);
  document.querySelector('#comparisons').append(figure);
}
document.querySelector('#request').onsubmit = event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = ['Hi Freddy,','I’d like to ask about my family tapes.','Formats: ' + ([...chosen].join(', ') || 'Not sure'),'Quantity: ' + data.get('quantity'),'Interest: ' + data.get('interest'),data.get('notes')].join('\n');
  const fallback = document.querySelector('#fallback');
  fallback.hidden = false;
  fallback.querySelector('textarea').value = message;
  location.href = 'mailto:hello@freddytech.ca?subject=My%20family%20tapes&body=' + encodeURIComponent(message);
};
