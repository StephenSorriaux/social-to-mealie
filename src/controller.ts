import fs from 'node:fs';
import { error } from 'elysia';
import { getUrl } from './instagram';
import { postRecipe } from './mealie';

// @ts-ignore
export default async function processRecipe({ body, env }) {
  try {
    const data = await getUrl({ env, url: body.url });
    if (fs.existsSync('output_audio.mp3')) {
      fs.unlinkSync('output_audio.mp3');
    }
    if (fs.existsSync('video.mp4')) {
      fs.unlinkSync('video.mp4');
    }
    if (fs.existsSync('output_audio.wav')) {
      fs.unlinkSync('output_audio.wav');
    }
    return JSON.stringify({
      data: `${env.MEALIE_URL}/g/home/r/${await postRecipe({ ...data, env })}`,
    });
  } catch (e: any) {
    return error('Internal Server Error', JSON.stringify({ error: e.message }));
  }
}
