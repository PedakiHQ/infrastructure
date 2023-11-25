import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string().startsWith('re_'),

    APP_DOCKER_USERNAME: z.string(),
    APP_DOCKER_PASSWORD: z.string(),
  },
  runtimeEnv: process.env,
});
