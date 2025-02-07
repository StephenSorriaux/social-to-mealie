import * as fs from 'node:fs';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import puppeteer from 'puppeteer';
import { snapsave } from 'snapsave-media-downloader';
import { getTranscription } from '../ai';
import { videofile } from '../constants';
import type { recipeInfo } from '../types';
import { Mp4ToMp3 } from '../utils';

ffmpeg.setFfmpegPath(ffmpegPath.path);

async function get_description({ url }: { url: string }): Promise<string> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], defaultViewport: null });
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
    );
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('meta[property="og:description"]', { timeout: 5000 });

    const description = await page.$eval('meta[property="og:description"]', (el) => el.getAttribute('content'));
    return description ? description : 'No description found';
  } catch (error) {
    console.error('Error:', error);
    return 'No description found';
  } finally {
    await browser.close();
  }
}

export async function getInstagram({ env, url }: { env: any; url: string }): Promise<recipeInfo> {
  const description = await get_description({ url });
  const res = await snapsave(url);
  if (
    !res ||
    !res.data ||
    !res.data.media ||
    res.data.media.length === 0 ||
    !res.data.media[0].url ||
    !res.data.media[0].thumbnail
  ) {
    throw new Error('No media found in the post');
  }
  const blobUrl = res.data.media[0].url;
  const blob = await fetch(blobUrl).then((r) => r.blob());
  fs.writeFileSync(videofile, Buffer.from(await blob.arrayBuffer()));
  await Mp4ToMp3();
  return {
    transcription: await getTranscription({ env }),
    thumbnail: res.data.media[0].thumbnail,
    description,
    postURL: url,
  };
}
