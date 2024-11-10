export async function getFAQs() {
  let craftUrl = "https://www.dunedin.govt.nz/__api/assets/1049187?data=contents";

  const res = await fetch(craftUrl, {
    cache: 'no-store',
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer b897d1eab5c85d23d3982fbeb26fb7da`,
    }
  });

  if (res.status !== 200) {
    throw new Error('Failed to fetch API');
  }

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json;
}
