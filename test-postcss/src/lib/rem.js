const baseFontSize = 75;
const baseWidth = 750;

function setRem() {
  const windowSize =
    document.body.clientWidth || document.documentElement.clientWidth;

  const _fontsize = (windowSize / baseWidth) * baseFontSize;

  document.documentElement.style.fontSize = _fontsize + "px";
}

window.onresize = function() {
  setRem();
};

setRem();
