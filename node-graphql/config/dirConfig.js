const fs = require("fs");
const path = require("path");

module.exports = function getFilePath(basePath) {
  const files = [];

  function _tranvers(_basePath) {
    const _dirPath = fs.readdirSync(_basePath);

    _dirPath.map((filePath) => {
      const currPath = path.resolve(_basePath, filePath);
      const isDir = fs.statSync(currPath).isDirectory();
      if (isDir) {
        _tranvers(currPath);
      } else {
        files.push(currPath);
      }
    });
  }
  _tranvers(basePath);

  return files.reduce((p, c, i) => ({ ...p, [i]: c }), {});
};
