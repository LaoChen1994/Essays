"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { spawnSync, exec } = require("child_process");

const FILE_TYPE = {
  FILE: 0,
  DIRECTORY: 1
};

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this._walkDirs = [];
    this.stop = false;
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
        default: true
      },
      {
        type: "list",
        name: "jsFrameSelection",
        message: "请选择前端使用的框架",
        choices: ["react"],
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log("欢迎使用皮蛋的Node BFF Cli");
    this._walk(this.destinationPath(), true);

    const deleteConfirm = [
      {
        type: "confirm",
        name: "isDelete",
        message: "当前文件夹下有文件"
      }
    ];

    if (!this._walkDirs.length) {
      return this._templatePromote();
    }

    return this.prompt(deleteConfirm)
      .then(({ isDelete }) => {
        if (isDelete) {
          this.log(chalk.yellow("正在删除当前文件夹下的文件~~~"));
          this._deleteFile();
          return this._templatePromote();
        }

        this.stop = true;
        throw Error("文件夹内存在文件且不能被删除，结束拉取模版");
      })
      .then(() => {
        const { templateType, jsFrameSelection } = this.props;

        if (templateType === "typescript" && jsFrameSelection === "react") {
          try {
            this.log(chalk.green("开始拉取模板, 请等待....."));
            const cloneRes = spawnSync("git", [
              "clone",
              `git@github.com:LaoChen1994/react-server-gen.git`
            ]);

            if (cloneRes.error) {
              this.log(
                `${chalk.red("git 拉取镜像错误")}: err -> ${cloneRes.error}`
              );
              return Promise.reject();
            }

            this.log(chalk.green("模板拉取成功！"));
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

  _install() {
    if (this.stop) return;

    this.log(chalk.yellow("开始安装依赖, 请等待"));
    const res = exec(
      "cd ./react-server-gen && npm run dep:install",
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
