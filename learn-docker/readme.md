## Docker学习笔记
### 学习思维导图

![思维导图](./image/Docker学习笔记的副本.svg)

### 打包自己的Web应用

```Dockerfile
FROM node:12
WORKDIR /
COPY . .
ENV NODE_ENV production
EXPOSE 3000

ENTRYPOINT [ "/bin/bash", "/script/start.sh" ]
```