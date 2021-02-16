this.addEventListener('install', function(event) {
    // 类似await，为了确保在waitUntil内的回调完成之后再结束对应的install操作
    console.log("install")
    event.waitUntil(
        // 打开名为my-cache-1的缓存
        caches.open('my-cache-1')
            .then(function(cache) {
                console.log(cache)
                // 缓存资源的白名单列表
                return cache.addAll([
                    '/static/index.js',
                    '/static/index.css',
                ])
            })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    )
})


self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(resp) {
        return resp || fetch(event.request).then(function(response) {
          return caches.open('my-cache-1').then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });
