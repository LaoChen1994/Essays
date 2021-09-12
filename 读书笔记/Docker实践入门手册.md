# Docker 技术入门与实战

## 一、基础知识

![](/Users/pidan/Work/分享笔记/脑图/Docker学习笔记.png)

## 二、使用Dockerfile创建镜像

### 2.1 Docker 主体信息

Dockerfile主体信息：

+ 基础镜像信息：基于基础的镜像信息，比如ubuntu:16.04
+ 维护者信息：LABEL maintainer ubuntu_user\<chenyixiang_cyx@youzan.com\>
+ 镜像操作指令：RUN xxx
+ 容器启动时执行指令：CMD xxx（每次构建阶段）

### 2.2 Docker 指令说明

![企业微信截图_3e012915-7fe4-4cdb-a0f2-878305d5fa3f](/Users/pidan/Library/Containers/com.tencent.WeWorkMac/Data/Library/Application Support/WXWork/Temp/ScreenCapture/企业微信截图_3e012915-7fe4-4cdb-a0f2-878305d5fa3f.png)

需要注意的变量

**AGE**: 用于定义在Dockerfile中使用的变量

```dockerfile
ARG NODE_VERSION=12
FROM node:${NODE_VERSION}
```

**EXPOSE**：用于声明内外应用接口的映射关系，这个地方只是声明，实际用的端口可能会和声明的不一样

**ENV**：环境变量，在容器生成过程中和后续生成的容器中都可用

**ENTERPOINT**: 启动容器时候的根命令，这个时候如果设置了CMD，CMD会作为根命令的参数

**WORKDIR**：切换RUN，ADD，COPY等操作指令的工作目录

```dockerfile
# 这个是dockerfile中用的变量名
ARG NODE_VERSION=12
FROM node:${NODE_VERSION}
LABEL maintainer="chenyixiang_cyx@youzan.com"
LABEL author="chenyixiang_cyx"
ENV NODE_ENV="production"
ENV SQL_USERNAME="cyx"
ENV SQL_PASSWORD = "123"
COPY ./source /
WORKDIR /


CMD [ "node", "./index.js" ]
```

![image-20210824234701217](/Users/pidan/Library/Application Support/typora-user-images/image-20210824234701217.png)

目前ENV中的参数已经打到docker中的环境变量中

### 2.3 最佳实践

1. 精简镜像的用途，让每个镜像的用途比较单一，避免构建大而复杂、多功能的镜像。
2. 选用合适的基础镜像，避免镜像过于冗余。
3. Dockerfile中提供注释和维护者的信息。
4. 使用明确的版本号
5. 生成镜像的层数尽可能的少，合并RUN，ADD和COPY命令
6. 多步骤创建，将编译和运行过程分开，通过多个Dockerfile
7. 及时删除缓存文件
8. 合理使用cache，在使用cache的场景下，不变的指令尽量放在前面
9. 减少外部数据源的干扰
10. 使用.dockerignore文件

## 三、实战训练

### 3. 1 操作系统

#### 3.1.1 busybox

简单的拉取和运行镜像的步骤

1. 拉取busybox的基础镜像

   ```bash
   docker pull busybox
   ```

2. 运行busybox

   ```bash
   docker run --it busybox bash
   ```

#### 3.1.2 Alpine

1. 拉取镜像

   ```bash
   docker pull alpine
   ```

2. 启动alpine

   ```bash
   docker run alpine echo '123'
   # 123
   ```



#### 3.1.3 Debian/Ubuntu

1. 拉取镜像

   ```bash
   docker pull ubuntu:16.04
   ```

2. 启动Ubuntu

   ```bash
   docker run -d -it ubuntu:16.04 bash
   ```

3. 安装curl

   ```bash
   # 先更新源
   apt-get update
   # 安装应用curl
   apt-get install curl
   ```

4. 安装apache2服务

   ```bash
   # 安装apache2
   apt-get install apache2
   # 运行apache2 
   service apache2 start
   ```

#### 3.1.4  CentOS/Fedora

1. 拉取镜像

   ```bash
   docker pull centos
   ```

2. 启动centos

   ```bash
   docker run -d -it centos bash
   ```

### 3.2 为容器添加ssh

#### **3.2.1 处理容器内命令的办法：**

1. 通过docker run或者docker attach的方式。 ❌
2. 利用ssh进行远程登录    ✅

#### 3.2.2 创建带有ssh容器的方式

1. 基于docker commit
2. 基于docker file

#### 3.2.3 使用docker commit方式

1. 拉取镜像 + 启动ubuntu

   ```bash
   docker pull ubuntu:16.04
   docker -d -it ubuntu:16.04 bash
   ```

2. 检查镜像

   ```bash
   apt-get update
   
   # 可以更换源
   vi /etc/apt/source.list.d/163.list
   
   # 这个自行百度下换源即可
   ```

3. 安装openssh-server

   ```bash
   apt-get install openssh-server
   ```

4. 创建sshd文件（启动ssh==必须的==）

   ```bash
   mkdir -p /var/run/sshd
   ```

5. 启动ssh

   ```bash
   # &在结尾代表该行命令在此终止
   /usr/sbin/sshd -D &
   
   # 结果标识开启的端口号
   # 4269 
   ```

6. 查看是否ssh已成功开启

   ```bash
   # 如果没有netstat需要安装net-tools
   apt-get install net-tools
   # 看到如下信息说明ssh已经开启
   netstat -tunple
   ```

   ![image-20210827005054484](/Users/pidan/Library/Application Support/typora-user-images/image-20210827005054484.png)

7. 修改安全登录配置

   其实就是把这一句注释掉

   ![image-20210827010124083](/Users/pidan/Library/Application Support/typora-user-images/image-20210827010124083.png)

8. 生成公钥和私钥，并复制到对应的容器中的authorization_keys下

   ```bash
   # 生成ssh-key
   # 可以在/root/.ssh下的id_rsa.pub中看到
   # 这个是退出容器在宿主机上的rsa
   ssh-keygen -t rsa
   
   # 打开/root/.ssh/authorization_keys
   ```

9. 编写run脚本，在root下

   ```bash
   # /bin/bash
   # run.sh
   /etc/init.d/ssh start
   ```

10. 修改脚本为可执行权限

    ```bash
    chomd +x run.sh
    ```

11. 退出容器

12. 提交docker 镜像

    ![image-20210829004838445](/Users/pidan/Library/Application Support/typora-user-images/image-20210829004838445.png)

    ```bash
    docker commit 32bb sshd:ubuntu
    ```

13. 运行docker镜像，并运行对应的run.sh文件

    ```bash
    docker run -d -it sshd:ubuntu sh /run.sh
    ```

14. 通过外部ssh进行登陆

    ```bash
    # 登陆
    # 这里我们设置的是root账户免登陆ssh
    ssh root@127.0.0.1 -p 10022
    # 下面就通过ssh的方式接入了容器
    ```

    

#### 3.2.4 使用dockerfile的方式创建

【注意】==docker run -d [images]== 可能会直接关闭镜像，现在需要，==docker run -d -t [images]==

1. 创建一个文件夹docker-ssh

2. 将对应生成的ssh key放到docker-ssh下，并将内容复制到authorized_keys下

3. 编写一个run.sh脚本，用来启动

   ```bash
   #! /bin/bash
   /usr/sbin/sshd -D

4. 可用的dockerfile如下：

  ```dockerfile
  FROM ubuntu:18.04
  LABEL maintainer="cyx"
  LABEL emain="chenyixiang_cyx@youzan.com"
  RUN apt-get update

  RUN apt-get install -y openssh-server
  RUN mkdir -p /var/run/sshd
  RUN mkdir -p /root/.ssh
  RUN sed -ri 's/session    required     pam_loginuid.so/#session    required     pam_loginuid.so/g' /etc/pam.d/sshd

  ADD authorized_keys /root/.ssh/authorized_keys
  WORKDIR /
  ADD run.sh /run.sh
  RUN chmod +x /run.sh

  EXPOSE 22

  ENTRYPOINT [ "/run.sh"]
  ```

这里需要注意的几个点：

1. 需要通过/usr/sbin/sshd来启动
2. 需要提前创建sshd和.ssh文件夹，不然会启不来

## 四、Web服务与应用

本章主要介绍用一些常见的Web服务器（Apache、Nginx、Tomcat等），以及一些通常的应用，包括LAMP和CI/CD。

打包方法：dockerfile + commit

### 4.1 Apache

#### 4.1.1 使用官方镜像

创建一个public.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div>Hello Docker</div>
</body>
</html>
```

使用dockerfile模式构建，目前apache已有专用的docker镜像httpd：

```dockerfile
FROM httpd:2.4

```







