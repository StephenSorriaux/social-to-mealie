import fs from 'node:fs';
import path from 'node:path';
import OpenAI from 'openai';

const filePath = path.resolve(__dirname, '../output_audio.mp3');

export async function getTranscription({ env }: { env: Record<string, string> }) {
  const ai = new OpenAI({
    baseURL: env.OPENAI_URL,
    apiKey: env.OPENAI_API_KEY,
  });
  const transcription = await ai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-1',
  });
  console.log(transcription.text);
  return transcription.text;
}
