export async function postRecipe({
  transcription,
  thumbnail,
  description,
  env,
}: { transcription: string; thumbnail: string; env: any; description: string }) {
  const res = await fetch(`${env.MEALIE_URL}/api/recipes/create/html-or-json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.MEALIE_API_KEY}`,
    },
    body: JSON.stringify({
      data: `The following content is a transcription from a video using whisper ai and the thumbnail is from the video on a social network which will be used as the cover for the recipe you will also receive the post description wich could contain more information about the ingredients. The transcription includes some timestamps wich they are not required for the mealie recipe. <transcription> ${transcription}</transcription> <thumbnail>: ${thumbnail}</thumbnail> <description>: ${description}</description>`,
    }),
  });
  return await res.json();
}
