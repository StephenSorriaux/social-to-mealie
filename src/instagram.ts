import * as fs from 'node:fs';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import puppeteer from 'puppeteer';
import { snapsave } from 'snapsave-media-downloader';
import { getTranscription } from './ai';

ffmpeg.setFfmpegPath(ffmpegPath.path);

async function get_description({ url }: { url: string }): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
    );
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('meta[property="og:description"]', { timeout: 5000 });

    // Extract the content of the meta tag
    const description = await page.$eval('meta[property="og:description"]', (el) => el.getAttribute('content'));
    return description ? description : 'No description found';
  } catch (error) {
    console.error('Error:', error);
    return 'No description found';
  } finally {
    await browser.close();
  }
}

export async function getUrl({ env, url }: { env: any; url: string }) {
  if (fs.existsSync('output_audio.mp3')) {
    fs.unlinkSync('output_audio.mp3');
  }
  if (fs.existsSync('video.mp4')) {
    fs.unlinkSync('video.mp4');
  }
  if (fs.existsSync('output_audio.wav')) {
    fs.unlinkSync('output_audio.wav');
  }
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
  fs.writeFileSync('video.mp4', Buffer.from(await blob.arrayBuffer()));
  await Mp4ToMp3();
  return {
    transcription: await getTranscription({ env }),
    thumbnail: res.data.media[0].thumbnail,
    description,
  };
}

async function Mp4ToMp3() {
  const tempMp4Path = 'video.mp4';
  const outputMp3Path = 'output_audio.mp3';

  return new Promise<void>((resolve, reject) => {
    ffmpeg(tempMp4Path)
      .toFormat('mp3')
      .on('end', () => {
        fs.unlinkSync(tempMp4Path);
        resolve();
      })
      .on('error', (err: unknown) => {
        console.error('Error en la conversión:', err);
        reject(err);
      })
      .save(outputMp3Path);
  });
}
