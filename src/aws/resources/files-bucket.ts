import * as aws from '@pulumi/aws';
import * as cloudflare from '@pulumi/cloudflare';
import { env } from '../../env';

export const createFilesBucket = () => {
  const bucket = new aws.s3.Bucket('files.pedaki.fr', {
    bucket: 'files.pedaki.fr',
    acl: 'private',
  });

  const record = new cloudflare.Record('files.pedaki.fr', {
    name: 'files',
    type: 'CNAME',
    value: bucket.bucketDomainName,
    zoneId: env.CLOUDFLARE_ZONE_ID,
    proxied: true,
    ttl: 1, // TTL must be set to 1 when proxied is true
    comment: `Automatically created by Pulumi`,
  });
};
