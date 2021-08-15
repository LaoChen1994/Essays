"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { spawnSync, exec, execSync } = require("child_process");

const FILE_TYPE = {
  FILE: 0,
  DIRECTORY: 1
};

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this._walkDirs = [];
    this.stop = false;
    this.isEmpty = true;
    this.projectName = "";
  }

  _deleteFile() {
    this._walkDirs.forEach(filePath => {
      const { path, type } = filePath;
      if (type === FILE_TYPE.DIRECTORY) {
        fs.rmdirSync(path);
      } else {
        fs.unlinkSync(filePath.path);
      }

      this.log(chalk.green(`${path}已删除成功`));
    });
  }

  _walk(basePath, recordDir = false) {
    const filenames = fs.readdirSync(basePath);
    if (filenames.length) {
      this.isEmpty = false;
      filenames.forEach(file => {
        const _path = path.join(basePath, file);
        try {
          if (fs.statSync(_path).isDirectory()) {
            this._walk(_path, recordDir);

            if (recordDir) {
              this._walkDirs.push({ path: _path, type: FILE_TYPE.DIRECTORY });
            }
          } else {
            this._walkDirs.push({ path: _path, type: FILE_TYPE.FILE });
          }
        } catch (error) {
          console.log("error = ", error);
        }
      });
    }
  }

  _templatePromote() {
    const prompts = [
      {
        type: "list",
        name: "templateType",
        message: "请选择模板的类型",
        choices: ["typescript"],
        default: "typescript"
      },
      {
        type: "list",
        name: "jsFrameSelection",
        message: "请选择前端使用的框架",
        choices: ["react", "vue"],
        default: "react"
      },
      {
        type: "confirm",
        name: "installDep",
        message: "是否需要安装依赖",
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
      this.stop = !props.installDep;
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log("欢迎使用皮蛋的Node BFF Cli");
    this._walk(this.destinationPath(), true);

    const preConfirm = [
      {
        type: "input",
        name: "projectName",
        message: "请输入工程名称"
      }
    ];

    return this.prompt(preConfirm)
      .then(({ projectName }) => {
        if (!projectName) throw Error("请输入有效的工程名");
        this.projectName = projectName;

        this.log(chalk.yellow("正在创建项目根目录"));
        fs.mkdirSync(projectName);
        this.log(chalk.green("根目录创建完毕！"));

        return this._templatePromote();
      })
      .then(() => {
        const { templateType, jsFrameSelection } = this.props;

        if (templateType === "typescript") {
          try {
            this.log(chalk.green("开始拉取模板, 请等待....."));
            const cloneRes = spawnSync("git", [
              "clone",
              "-b",
              `feat/${jsFrameSelection}-dev`,
              "git@github.com:LaoChen1994/react-server-gen.git"
            ]);

            this._error(cloneRes, "git 拉取镜像错误！");
            this.log(chalk.green("模板拉取成功！"));

            const copyRes = execSync(
              `cp -r ./react-server-gen/* ./${this.projectName}`
            );
            const deleteRes = spawnSync("rm", ["-rf", "./react-server-gen"]);
            this._error(copyRes, "拷贝文件异常！");
            this._error(deleteRes, "删除原文件失败");

            return Promise.resolve();
          } catch (error) {
            this.log(chalk.red("未知错误, ", error));
          }
        }
      })
      .then(() => this._install())
      .catch(err => {
        console.log(chalk.red(err));
      });
  }

  _error(err, msg) {
    if (err.error) {
      this.stop = true;
      console.log(err.error);
      this.log(chalk.red(msg));
      throw Error(err.error);
    }
  }

  _install() {
    if (this.stop) return;

    this.log(chalk.yellow("开始安装依赖, 请等待"));
    const res = exec(
      `cd ./${this.projectName} && npm run dep:install`,
      (err, stdout) => {
        if (err) {
          this.log(chalk.red("未知错误, error = ", err));
          return;
        }

        console.log(stdout);
      }
    );

    res.on("close", () => {
      this.log(chalk.green("依赖安装完成"));
    });
  }
};
