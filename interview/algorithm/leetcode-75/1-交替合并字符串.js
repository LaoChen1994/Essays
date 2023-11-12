/**
 * @param {string} word1
 * @param {string} word2
 * @return {string}
 */
var mergeAlternately = function(word1, word2) {
  const p1 = 0, p2 = 0;
  const len1 = word1.length, len2 = word2.length;
  let res = "";

  while(p1 < len1 && p2 < len2) {
    res += word1[p1]
    res += word2[p2];
    p1++;
    p2++;
  }

  if (p1 === len1 && p2 < len2) {
    res += word2.slice(p2);
  }

  if (p1 < len1) {
    res += word1.slice(p1)
  }

  return res
};