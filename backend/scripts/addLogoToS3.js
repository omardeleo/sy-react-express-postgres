const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const config = {
  accessKeyId: 'abc',
  secretAccessKey: '123',
  endpoint: 'http://localstack:4566',
  s3ForcePathStyle: true,
  ACL: 'public-read',
}

const s3 = new aws.S3(config);

const uploadFile = (fileName) => {
  const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
  const params = {
    Bucket: 'test-bucket',
    Key: `logo.png`, // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
        throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
}

const dirPath = path.join(__dirname, "/logo/logo.png");
uploadFile(dirPath);
