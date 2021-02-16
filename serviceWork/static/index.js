if (navigator.serviceWorker) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/static/sw.js", { scope: "/static/" })
      .then(function (registration) {
        console.log("success");
        // 只能对对应scope域下的页面有效
        // 不支持越域
        console.log(registration.scope);
      });
  });
}

function handleClick() {
  fetch("/static/query", {
    method: "get",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 已经缓存成功
console.log(
  caches
    .match("/static/index.css")
    .then((data) => data.text())
    .then((res) => console.log(res))
);
