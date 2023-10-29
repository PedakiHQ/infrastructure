import * as aws from "@pulumi/aws";

export class ApiPulumiUser {

    constructor() {
        // IAM user that will be responsible to create the ec2, rds, etc. for the whole stack

        const user = new aws.iam.User("api-pulumi", {
            name: "api-pulumi",
        });

        const userAccessKey = new aws.iam.AccessKey("api-pulumi-key", {user: user.name});

        const userPolicy = new aws.iam.UserPolicy("api-pulumi-policy", {
            user: user.name,
            policy: {
                Version: "2012-10-17",
                Statement: [{
                    Action: ["ec2:Describe*"],
                    Effect: "Allow",
                    Resource: "*",
                }],
            },
        });
    }
}