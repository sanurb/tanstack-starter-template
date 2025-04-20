import { z } from 'zod';

import { logger } from '~/lib/logger';
import { handleZodErrors } from '~/lib/zod';

const PUBLIC_ENV_PREFIX = 'VITE_' as const;

// https://docs.solidjs.com/configuration/environment-variables

const publicSchema = createEnvSchema('Public', {
  VITE_APP_NAME: z.string(),
});

const privateSchema = createEnvSchema('Private', {});

function parseEnv() {
  const result = z
    .object({
      ...publicSchema.shape,
      ...privateSchema.shape,
    })
    .safeParse({
      ...import.meta.env,
      ...process.env,
    });

  if (result.error) {
    handleZodErrors(result.error);

    throw new Error('Invalid environment variables');
  }

  const total = Object.keys(result.data).length;

  logger.info(`Environment variables parsed successfully (${total} variables)`);
}

function createEnvSchema<Shpae extends z.ZodRawShape>(
  type: 'Public' | 'Private',
  shape: Shpae
) {
  for (const key in shape) {
    if (Object.prototype.hasOwnProperty.call(shape, key)) {
      if (type === 'Public' && !key.startsWith(PUBLIC_ENV_PREFIX)) {
        throw new Error(
          `Public environment variables must start with "${PUBLIC_ENV_PREFIX}", got "${key}"`
        );
      }

      if (type === 'Private' && key.startsWith(PUBLIC_ENV_PREFIX)) {
        throw new Error(
          `Private environment variables must not start with "${PUBLIC_ENV_PREFIX}", got "${key}"`
        );
      }
    }
  }

  return z.object(shape);
}

interface ViteBuiltInEnv {
  MODE: 'development' | 'production' | 'test';
  DEV: boolean;
  SSR: boolean;
  PROD: boolean;
  BASE_URL: string;
}

declare global {
  interface ImportMetaEnv
    extends z.infer<typeof publicSchema>,
      ViteBuiltInEnv {}

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  // biome-ignore lint/style/noNamespace: <explanation>
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof privateSchema> {}
  }
}

export { parseEnv };
