// Import the package main module
const csv = require("csv");
const Stream = require("stream");
const fs = require("fs");
const assert = require("assert");

const inStream = new Stream.Readable({});
const writer = new fs.createWriteStream("./test.csv");

csv.parse(
  `
  "编号","标题","描述","关键词","链接"
  "m2l tdk信息","m2l tdk信息","www.test1.com","m2l tdk信息","1"
  "TDK测试数据1","TDK测试数据1","www.test.com","TDK测试数据1","1"
`.trim(),
  {
    columns: ['key1', 'key2', 'key3', 'key4', 'key5'],
    delimiter: ',',
    escape: "'",
    columns_duplicates_to_array: true
  },
  function (err, records) {
    console.log('records = ', records)
    return records
  }
).pipe(
  csv.transform(function(data) {
    console.log('data = ', data)
    return data
  })
).pipe(
  csv.stringify()
).pipe(writer)

// Use the module
// csv
//   .generate({ seed: 1, length: 20 })
//   .pipe(csv.parse())
//   .pipe(
//     csv.transform(function (record) {
//       return record.map(function (value) {
//         return value.toUpperCase();
//       });
//     })
//   )
//   .pipe(csv.stringify())
//   .pipe(writer);
