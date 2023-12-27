import * as aws from '@pulumi/aws';
import * as cloudflare from '@pulumi/cloudflare';
import { env } from '../../env';
import { TAGS } from '../constants';

export const createStaticBucket = () => {
  const bucket = new aws.s3.Bucket('static.pedaki.fr', {
    bucket: 'static.pedaki.fr',
    acl: 'public-read',
    tags: TAGS,
  });

  const publicAccessBlock = new aws.s3.BucketPublicAccessBlock(
    'static.pedaki.fr-publicAccessBlock',
    {
      bucket: bucket.id,
      blockPublicAcls: false,
      ignorePublicAcls: false,
      blockPublicPolicy: false,
      restrictPublicBuckets: false,
    },
  );

  const _ = new aws.s3.BucketPolicy(
    'static-bucket-policy',
    {
      bucket: bucket.id,
      policy: bucket.arn.apply(arn =>
        JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`${arn}/*`],
            },
          ],
        }),
      ),
    },
    { dependsOn: [publicAccessBlock] },
  );

  const record = new cloudflare.Record('static.pedaki.fr', {
    name: 'static',
    type: 'CNAME',
    value: bucket.bucketDomainName,
    zoneId: env.CLOUDFLARE_ZONE_ID,
    proxied: true,
    ttl: 1, // TTL must be set to 1 when proxied is true
    comment: `pulumi (infrastructure repo)`,
  });
};
