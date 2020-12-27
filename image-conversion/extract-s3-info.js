module.exports = function extractS3Info(event) {
  const eventRecord = event.Records && event.Records[0],
    bucket = eventRecord.s3.bucket.name,
    key = eventRecord.s3.object.key;
  console.log(eventRecord.s3.object);
  console.log(eventRecord.s3);
  return { bucket, key };
};
