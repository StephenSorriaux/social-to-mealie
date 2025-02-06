import fs from 'node:fs';
import { snapsave } from 'snapsave-media-downloader';
import { getTranscription } from '../ai';
import { videofile } from '../constants';
import type { recipeInfo } from '../types';
import { Mp4ToMp3 } from '../utils';

export async function getTiktok({ env, url }: { env: any; url: string }): Promise<recipeInfo> {
  const res = await snapsave(url);
  if (!res || !res.data || !res.data.media || !res.data.media[0].url || !res.data.description || !res.data.preview) {
    throw new Error('No media found in the post');
  }
  const blobUrl = res.data.media[0].url;
  const blob = await fetch(blobUrl).then((r) => r.blob());
  fs.writeFileSync(videofile, Buffer.from(await blob.arrayBuffer()));
  await Mp4ToMp3();
  return {
    transcription: await getTranscription({ env }),
    thumbnail: res.data.preview,
    description: res.data.description,
    postURL: url,
  };
}
