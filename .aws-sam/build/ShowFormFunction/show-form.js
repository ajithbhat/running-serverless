const jsonResponse = require("./json-response");
const aws = require("aws-sdk");
const s3 = new aws.S3();
const uploadLimitInMB = parseInt(process.env.UPLOAD_LIMIT_IN_MB);
exports.lambdaHandler = async (event, context) => {
  const key = context.awsRequestId + ".jpg",
    uploadParams = {
      Bucket: process.env.UPLOAD_S3_BUCKET,
      Expires: 600,
      Conditions: [["content-length-range", 1, uploadLimitInMB * 1000000]],
      Fields: {
        acl: "private",
        key: key,
      },
    },
    uploadForm = s3.createPresignedPost(uploadParams),
    downloadParams = {
      Bucket: process.env.THUMBNAILS_S3_BUCKET,
      Key: key,
      Expires: 600,
    },
    downloadUrl = s3.getSignedUrl("getObject", downloadParams);
  return jsonResponse({
    upload: uploadForm,
    download: downloadUrl,
  });
};

// const htmlResponse = require("./html-response");
// const buildForm = require("./build-form");
// const aws = require("aws-sdk");
// const s3 = new aws.S3();
// const uploadLimitInMB = parseInt(process.env.UPLOAD_LIMIT_IN_MB);

// exports.lambdaHandler = async (event, context) => {
//   // console.log(event);
//   const apiHost = event.requestContext.domainName,
//     prefix = event.requestContext.stage,
//     redirectUrl = `https://${apiHost}/${prefix}/confirm`,
//     params = {
//       Bucket: process.env.UPLOAD_S3_BUCKET,
//       Expires: 600,
//       Conditions: [["content-length-range", 1, uploadLimitInMB * 1000000]],
//       Fields: {
//         success_action_redirect: redirectUrl,
//         acl: "private",
//         key: context.awsRequestId + ".jpg",
//         // key: context.awsRequestId,
//       },
//     },
//     form = s3.createPresignedPost(params);
//   return htmlResponse(buildForm(form));
// };
// // const axios = require('axios')
// // const url = 'http://checkip.amazonaws.com/';
// let response;

// /**
//  *
//  * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
//  * @param {Object} event - API Gateway Lambda Proxy Input Format
//  *
//  * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
//  * @param {Object} context
//  *
//  * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
//  * @returns {Object} object - API Gateway Lambda Proxy Output Format
//  *
//  */
// exports.lambdaHandler = async (event, context) => {
//   try {
//     // const ret = await axios(url);
//     console.log(JSON.stringify(event, null, 2));
//     debugger;
//     response = {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: "hello world latest",
//         // location: ret.data.trim()
//       }),
//     };
//   } catch (err) {
//     console.log(err);
//     return err;
//   }

//   return response;
// };

// const htmlResponse = require("./html-response");
// const formHtml = `
// <html>
// <head>
// <meta charset="utf-8"/>
// </head>
// <body>
// <form method="POST">
// Please enter your name:
//  <input type="text" name="name"/>
//  <br/>
//  <input type="submit" />
//  </form>
//  </body>
//  </html>
//  `;
// const thanksHtml = `
//   <html>
//   <head>
//   <meta charset="utf-8"/>
//   </head>
//   <body>
//   <h1>Thanks</h1>
//   <p>We received your submission</p>
//   </body>
//   </html>
//   `;

// exports.lambdaHandler = async (event, context) => {
//   // console.log(JSON.stringify(event, null, 2));

//   // if (event.httpMethod === "GET") {
//   return htmlResponse(formHtml);
//   // } else {
//   //   return htmlResponse(thanksHtml);
//   // }
// };
