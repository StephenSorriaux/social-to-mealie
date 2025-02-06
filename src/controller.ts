import { error } from 'elysia';
import { postRecipe } from './mealie';
import { getInstagram } from './social-networks/instagram';
import { getTiktok } from './social-networks/tiktok';
import type { recipeInfo } from './types';
import { removeMedia } from './utils';

// @ts-ignore
export default async function processRecipe({ body, env }) {
  try {
    removeMedia();
    let data: recipeInfo;
    if (body.url.includes('instagram')) {
      data = await getInstagram({ env, url: body.url });
    } else if (body.url.includes('tiktok')) {
      data = await getTiktok({ env, url: body.url });
    } else {
      return error(400, JSON.stringify({ error: 'Invalid URL' }));
    }
    removeMedia();
    return JSON.stringify({
      data: `${env.MEALIE_URL}/g/home/r/${await postRecipe(data, env)}`,
    });
  } catch (e: any) {
    return error('Internal Server Error', JSON.stringify({ error: e.message }));
  }
}
