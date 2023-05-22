const fs = require("fs");
const S3rver = require("s3rver");

console.log("we are here");

new S3rver({
  port: 9000,
  address: "0.0.0.0",
  directory: "./s3",
  configureBuckets: [
    {
      name: "wdc-online-course-platform",
      configs: [fs.readFileSync("./cors.xml")],
    },
  ],
}).run();
