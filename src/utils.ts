import fs from 'node:fs';
import ffmpeg from 'fluent-ffmpeg';
import { audiofile, videofile } from './constants';

export async function Mp4ToMp3() {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(videofile)
      .toFormat('mp3')
      .on('end', () => {
        fs.unlinkSync(videofile);
        resolve();
      })
      .on('error', (err: unknown) => {
        console.error('Error en la conversión:', err);
        reject(err);
      })
      .save(audiofile);
  });
}

export function removeMedia() {
  if (fs.existsSync(audiofile)) {
    fs.unlinkSync(audiofile);
  }
  if (fs.existsSync(videofile)) {
    fs.unlinkSync(videofile);
  }
  if (fs.existsSync('output_audio.wav')) {
    fs.unlinkSync('output_audio.wav');
  }
}

export function getVideoThumbnail() {
  return new Promise<string>((resolve, reject) => {
    ffmpeg(videofile)
      .on('end', () => {
        resolve('thumbnail.png');
      })
      .on('error', (err: unknown) => {
        console.error('Error en la conversión:', err);
        reject(err);
      })
      .screenshots({
        count: 1,
        filename: 'thumbnail.png',
        folder: '.',
      });
  });
}
