const fs = require("fs");
const S3rver = require("s3rver");

new S3rver({
  port: 5000,
  directory: "./s3",
  configureBuckets: [
    {
      name: "wdc-online-course-platform",
      configs: [fs.readFileSync("./cors.xml")],
    },
  ],
}).run();
