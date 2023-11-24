import * as aws from "@pulumi/aws";

export const createApiPulumiUser = () => {
    // IAM user that will be responsible to create the ec2, rds, etc. for the whole stack
    const user = new aws.iam.User("api-pulumi", {
        name: "api-pulumi",
    });

    const _ = new aws.iam.UserPolicy("api-pulumi-policy", {
        user: user.name,
        policy: {
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "AllowEC2RDS",
                    Action: [
                        "ec2:*",
                        "rds:*",
                    ],
                    Effect: "Allow",
                    Resource: "*",
                },
                {
                    Sid: "RestrictEC2",
                    Action: [
                        "ec2:RunInstances",
                    ],
                    Effect: "Deny",
                    Resource: "arn:aws:ec2:*:*:instance/*",
                    Condition: {
                        "ForAnyValue:StringNotLike": {
                            "ec2:InstanceType": [
                                "*.nano",
                                "*.micro",
                                "*.small"
                            ]
                        }
                    }
                },
                {
                    Sid: "RestrictRDSTypes",
                    Action: [
                        "rds:CreateDBInstance",
                    ],
                    Effect: "Deny",
                    Resource: "*",
                    Condition: {
                        "ForAnyValue:StringNotLike": {
                            "rds:DBInstanceClass": [
                                "*.nano",
                                "*.micro",
                                "*.small"
                            ]
                        }
                    }
                },
                {
                    Sid: "Tagging",
                    Action: [
                        "ec2:CreateTags",
                        "ec2:DeleteTags",
                        "rds:AddTagsToResource",
                        "rds:RemoveTagsFromResource",
                        "rds:ListTagsForResource",
                    ],
                    Effect: "Allow",
                    Resource: [
                        "arn:aws:ec2:*:*:instance/*",
                        "arn:aws:ec2:*:*:network-interface/*",
                        "arn:aws:ec2:*:*:security-group/*",
                        "arn:aws:ec2:*:*:internet-gateway/*",
                        "arn:aws:ec2:*:*:route-table/*",
                        "arn:aws:ec2:*:*:subnet/*",
                        "arn:aws:ec2:*:*:volume/*",
                        "arn:aws:ec2:*:*:vpc/*",
                        "arn:aws:rds:*:*:subgrp:*",
                        "arn:aws:rds:*:*:db:*",
                    ]
                },
                {
                    Sid: "AllowSecrets",
                    Action: [
                        "secretsmanager:CreateSecret",
                        "secretsmanager:DeleteSecret",
                        "secretsmanager:DescribeSecret",
                    ],
                    Effect: "Allow",
                    Resource: "*",
                }
            ],
        },
    });
}