### Blob学习

#### 1. String与ArrayBuffer之间的转换

~~~javascript
// arrayBuffer to String
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

// String to ArrayBuffer
function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
~~~