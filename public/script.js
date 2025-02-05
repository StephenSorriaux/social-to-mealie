const input = document.querySelector('input');
const button = document.querySelector('button');
const body = document.querySelector('body');

button.addEventListener('click', async () => {
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
    return;
  }
  const newLink = document.createElement('a');
  newLink.href = data.data;
  newLink.innerHTML = 'Mealie created recipe';
  body.appendChild(newLink);
});
