import { html } from '@elysiajs/html';
import staticPlugin from '@elysiajs/static';
import { env as elysiaEnv } from '@yolk-oss/elysia-env';
import { Elysia, t } from 'elysia';
import processRecipe from './controller';

const app = new Elysia()
  .use(
    elysiaEnv({
      OPENAI_URL: t.String(),
      OPENAI_API_KEY: t.String(),
      WHISPER_MODEL: t.String(),
      MEALIE_URL: t.String(),
      MEALIE_API_KEY: t.String(),
    }),
  )
  .use(html())
  .use(staticPlugin())
  .post('/get-url', async ({ body, env }) => await processRecipe({ body, env }), {
    body: t.Object({
      url: t.String(),
    }),
  })
  .get('/', () => Bun.file('./public/index.html'))
  .listen(3000);

console.log(`Social media to mealie at ${app.server?.hostname}:${app.server?.port}`);
