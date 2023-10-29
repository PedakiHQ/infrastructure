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
                    Sid: "AllowEC2Types",
                    Action: [
                        "ec2:RunInstances",
                        "ec2:TerminateInstances",
                        "ec2:StartInstances",
                        "ec2:StopInstances",
                    ],
                    Effect: "Allow",
                    Resource: "*",
                    Condition: {
                        StringEquals: {
                            "ec2:InstanceType": "t2.micro",
                        },
                    },
                },
                {
                    Sid: "AllowEC2Describe",
                    Action: ["ec2:Describe*"],
                    Effect: "Allow",
                    Resource: "*",
                },
                {
                    Sid: "AllowEC2Vpc",
                    Action: [
                        "ec2:CreateVpc",
                        "ec2:DeleteVpc",
                        "ec2:CreateSubnet",
                        "ec2:DeleteSubnet",
                        "ec2:CreateSecurityGroup",
                        "ec2:DeleteSecurityGroup",
                        "ec2:AuthorizeSecurityGroupIngress",
                        "ec2:RevokeSecurityGroupIngress",
                        "ec2:ModifyVpcAttribute",
                    ],
                    Effect: "Allow",
                    Resource: "*",
                },
                {
                    Sid: "Tagging",
                    Action: [
                        "ec2:CreateTags",
                        "ec2:DeleteTags",
                    ],
                    Effect: "Allow",
                    Resource: [
                        "arn:aws:ec2:*:*:instance/*",
                        "arn:aws:ec2:*:*:network-interface/*",
                        "arn:aws:ec2:*:*:security-group/*",
                        "arn:aws:ec2:*:*:subnet/*",
                        "arn:aws:ec2:*:*:volume/*",
                        "arn:aws:ec2:*:*:vpc/*",
                    ]
                },
                {
                    Sid: "AllowRDSTypes",
                    Action: [
                        "rds:CreateDBInstance",
                        "rds:DeleteDBInstance",
                        "rds:StartDBInstance",
                        "rds:StopDBInstance",
                    ],
                    Effect: "Allow",
                    Resource: "*",
                    Condition: {
                        StringEquals: {
                            "rds:DatabaseClass": "db.t2.micro",
                        },
                    },
                }
            ],
        },
    });
}