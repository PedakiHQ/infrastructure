import * as aws from '@pulumi/aws';
import * as cloudflare from '@pulumi/cloudflare';
import { env } from '../../env';

export const createFilesBucket = () => {
  const bucket = new aws.s3.Bucket('files.pedaki.fr', {
    bucket: 'files.pedaki.fr',
    acl: 'private',
    serverSideEncryptionConfiguration: {
      rule: {
        applyServerSideEncryptionByDefault: {
          sseAlgorithm: 'aws:kms',
        },
        bucketKeyEnabled: true,
      },
    },
  });

  const publicAccessBlock = new aws.s3.BucketPublicAccessBlock('files.pedaki.fr-publicAccessBlock', {
    bucket: bucket.id,
    blockPublicAcls: false,
    blockPublicPolicy: false,
    ignorePublicAcls: false,
    restrictPublicBuckets: false,
  });

  const policy = new aws.s3.BucketPolicy(
    'files-bucket-policy',
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
          ],
        }),
      ),
    },
    { dependsOn: [publicAccessBlock] },
  );

  const record = new cloudflare.Record('files.pedaki.fr', {
    name: 'files',
    type: 'CNAME',
    value: bucket.bucketDomainName,
    zoneId: env.CLOUDFLARE_ZONE_ID,
    proxied: true,
    ttl: 1, // TTL must be set to 1 when proxied is true
    comment: `pulumi (infrastructure repo)`,
  });
};
