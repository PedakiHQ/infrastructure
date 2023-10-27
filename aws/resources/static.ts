import * as pulumi from '@pulumi/pulumi';
import * as aws from "@pulumi/aws";

export class StaticBucket extends pulumi.ComponentResource {

    constructor(opts?: pulumi.ComponentResourceOptions) {
        super("custom:resource:StaticBucket", "static-bucket", {}, opts);

        const bucket = new aws.s3.Bucket("static.pedaki.fr");

        const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("exampleBucketPublicAccessBlock", {
            bucket: bucket.id,
            blockPublicAcls: true,
            blockPublicPolicy: true,
            ignorePublicAcls: true,
            restrictPublicBuckets: true,
        });

        new aws.s3.BucketPolicy("bucket-policy", {
            bucket: bucket.id,
            policy: bucket.arn.apply((arn) => JSON.stringify({
                Version: "2012-10-17",
                Statement: [{
                    Effect: "Allow",
                    Principal: "*",
                    Action: ["s3:GetObject"],
                    Resource: [`${arn}/*`],
                }],
            })),
        }, {dependsOn: [publicAccessBlock]});

        this.registerOutputs({
            bucketName: bucket.id,
        });
    }
}