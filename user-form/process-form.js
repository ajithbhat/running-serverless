const htmlResponse = require("./html-response");
const aws = require("aws-sdk");
const s3 = new aws.S3();

exports.lambdaHandler = async (event, context) => {
  //   console.log(event);
  //   console.log(context);
  const bucketName = process.env.UPLOAD_S3_BUCKET;
  await s3
    .putObject({
      Bucket: bucketName,
      Key: context.awsRequestId,
      Body: JSON.stringify(event),
    })
    .promise();
  const thanksHtml = `
 <html>
 <head>
 <meta charset="utf-8"/>
 </head>
 <body>
 <h1>Thanks</h1>
 <p>We received your submission</p>
 <p>Reference: ${context.awsRequestId}</p>
 </p>
 </body>
 </html>
 `;

  return htmlResponse(thanksHtml);
};
