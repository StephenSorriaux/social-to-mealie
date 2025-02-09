import fs from 'node:fs';
import path from 'node:path';
import OpenAI from 'openai';
import { audiofile } from './constants';

const filePath = path.resolve(__dirname, `../${audiofile}`);

export async function getTranscription({ env }: { env: Record<string, string> }) {
  const ai = new OpenAI({
    baseURL: env.OPENAI_URL,
    apiKey: env.OPENAI_API_KEY,
  });
  const transcription = await ai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: env.WHISPER_MODEL,
  });
  console.log(transcription.text);
  return transcription.text;
}
