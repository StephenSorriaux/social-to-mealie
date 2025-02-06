const input = document.querySelector('input');
const button = document.querySelector('button');
const body = document.querySelector('body');
const spinner = document.getElementById('spinner');

body.removeChild(spinner);

button.addEventListener('click', async () => {
  body.appendChild(spinner);
  const res = await fetch('/get-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: input.value }),
  });
  const data = await res.json();
  if (data.error) {
    alert(data.error);
    body.removeChild(spinner);
    return;
  }
  const newLink = document.createElement('a');
  newLink.href = data.data;
  newLink.innerHTML = 'Mealie created recipe';
  body.appendChild(newLink);
  body.removeChild(spinner);
});
