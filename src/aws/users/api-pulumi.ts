import * as aws from '@pulumi/aws';

export const createApiPulumiUser = () => {
  // IAM user that will be responsible to create the ec2, rds, etc. for the whole stack
  const user = new aws.iam.User('api-pulumi', {
    name: 'api-pulumi',
  });

  const _ = new aws.iam.UserPolicy('api-pulumi-policy', {
    user: user.name,
    policy: {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'AllowEC2RDS',
          Action: ['ec2:*', 'rds:*'],
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Sid: 'RestrictEC2',
          Action: ['ec2:RunInstances'],
          Effect: 'Deny',
          Resource: 'arn:aws:ec2:*:*:instance/*',
          Condition: {
            'ForAnyValue:StringNotLike': {
              'ec2:InstanceType': ['*.nano', '*.micro', '*.small'],
            },
          },
        },
        {
          Sid: 'RestrictRDSTypes',
          Action: ['rds:CreateDBInstance'],
          Effect: 'Deny',
          Resource: '*',
          Condition: {
            'ForAnyValue:StringNotLike': {
              'rds:DBInstanceClass': ['*.nano', '*.micro', '*.small'],
            },
          },
        },
        {
          Sid: 'AllowSecrets',
          Action: ['secretsmanager:*'],
          Effect: 'Allow',
          Resource: [
            'arn:aws:secretsmanager:*:*:secret:premium/*',
            'arn:aws:secretsmanager:*:*:secret:shared/*',
          ],
        },
        {
          Sid: 'AllowParameterStore',
          Action: ['ssm:*'],
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Sid: 'AllowIAM',
          Action: [
            'iam:CreateInstanceProfile',
            'iam:DeleteInstanceProfile',
            'iam:TagInstanceProfile',
            'iam:UntagInstanceProfile',
            'iam:GetInstanceProfile',
          ],
          Effect: 'Allow',
          Resource: '*',
        }
      ],
    },
  });
};
