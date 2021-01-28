const express = require('express');
const aws = require('aws-sdk');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const db = require("../db/models");

const router = express.Router();

const incrementCounter = async (counter) => {
  const { count } = counter;
  await db.Counter.update({ count: count + 1 }, {
    where: { count: count }
  });
  return count + 1;
}

const createCounter = async () => {
  const counter = await db.Counter.create({
      count: 1,
      createdAt: new Date(),
      updatedAt: new Date()
  });
  return counter.count;
}

const config = {
  accessKeyId: 'abc',
  secretAccessKey: '123',
  endpoint: 'http://localstack:4566',
  s3ForcePathStyle: true,
  ACL: 'public-read',
}

router.get('/api/v1/files', async function(req, res, next) {
  const s3 = new aws.S3(config);
  s3.createBucket = promisify(s3.createBucket);
  s3.listObjects = promisify(s3.listObjects);
  await s3.createBucket({Bucket: 'test-bucket'});
  const data = await s3.listObjects({Bucket: 'test-bucket'});

  res.json(data);
});

router.get('/api/v1/files/upload/:file', async function(req, res, next) {
  const s3 = new aws.S3(config);
  const uploadFile = async (fileName) => {
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'test-bucket',
        Key: `upload-${Date.now()}.jpg`, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
  };
  const dirPath = path.join(__dirname, req.params.file);
  await uploadFile(dirPath);

  res.redirect('/api/v1/files/')
});

/* GET home page. */
router.get('/api/v1/', async function(req, res, next) {
  const counters = await db.Counter.findAll();
  const counter = counters.length
    ? await incrementCounter(counters[0])
    : await createCounter();

  const response = `Hi! I'm an Express server.\n
I'm running on port 8080.
I've been pinged ${counter} times.
Last pinged on ${new Date()}`;

  res.json({response: response});
});

module.exports = router;
