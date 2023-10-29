import * as aws from "@pulumi/aws";

export const createStaticBucket = () => {

    const bucket = new aws.s3.Bucket("static.pedaki.fr", {
        bucket: "static.pedaki.fr",
    });

    const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("publicAccessBlock", {
        bucket: bucket.id,
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
    });

    const _ = new aws.s3.BucketPolicy("bucket-policy", {
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
}