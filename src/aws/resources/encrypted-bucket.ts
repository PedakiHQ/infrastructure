import * as aws from '@pulumi/aws';
import * as cloudflare from '@pulumi/cloudflare';
import { env } from '../../env';
import { TAGS } from '../constants';

export const createEncryptedBucket = () => {
  const bucket = new aws.s3.Bucket('encrypted.pedaki.fr', {
    bucket: 'encrypted.pedaki.fr',
    acl: 'private',
    serverSideEncryptionConfiguration: {
      rule: {
        applyServerSideEncryptionByDefault: {
          sseAlgorithm: 'aws:kms',
        },
        bucketKeyEnabled: true,
      },
    },
    tags: TAGS,
  });

  const publicAccessBlock = new aws.s3.BucketPublicAccessBlock(
    'encrypted.pedaki.fr-publicAccessBlock',
    {
      bucket: bucket.id,
      blockPublicAcls: true,
      ignorePublicAcls: true,
      blockPublicPolicy: true,
      restrictPublicBuckets: true,
    },
  );

  const policy = new aws.s3.BucketPolicy(
    'encrypted-bucket-policy',
    {
      bucket: bucket.id,
      policy: bucket.arn.apply(arn =>
        JSON.stringify({
          // all files should be encrypted
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'DenyUnEncryptedObjectUploads',
              Effect: 'Deny',
              Principal: '*',
              Action: 's3:PutObject',
              Resource: `${arn}/*`,
              Condition: {
                StringNotEquals: {
                  's3:x-amz-server-side-encryption': 'aws:kms',
                },
              },
            },
            {
              Sid: 'DenyUnEncryptedObjectDownloads',
              Effect: 'Deny',
              Principal: '*',
              Action: 's3:GetObject',
              Resource: `${arn}/*`,
              Condition: {
                Bool: {
                  'aws:SecureTransport': 'false',
                },
              },
            },
          ],
        }),
      ),
    },
    { dependsOn: [publicAccessBlock] },
  );

  const record = new cloudflare.Record('encrypted.pedaki.fr', {
    name: 'encrypted',
    type: 'CNAME',
    value: bucket.bucketDomainName,
    zoneId: env.CLOUDFLARE_ZONE_ID,
    proxied: true,
    ttl: 1, // TTL must be set to 1 when proxied is true
    comment: `pulumi (infrastructure repo)`,
  });
};
