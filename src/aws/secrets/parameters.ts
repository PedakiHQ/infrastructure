import * as aws from '@pulumi/aws';
import { env } from '../../env';

export const createSharedParameters = () => {
  createSecret(
    `resend`,
    'Resend credentials',
    JSON.stringify({
      RESEND_API_KEY: env.RESEND_API_KEY,
      RESEND_EMAIL_DOMAIN: 'pedaki.fr',
    }),
  );

  createSecret(
    `docker`,
    'Docker credentials',
    JSON.stringify({
      APP_DOCKER_USERNAME: env.APP_DOCKER_USERNAME,
      APP_DOCKER_PASSWORD: env.APP_DOCKER_PASSWORD,
    }),
  );
};

function createSecret(name: string, description: string, value: string) {
  const secret = new aws.ssm.Parameter(name, {
    name: `/shared/${name}`,
    description,
    type: 'SecureString',
    value: value,
  });

  return secret.name;
}
