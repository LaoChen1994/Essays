'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');
const path = require('path');
const { spawnSync, exec } = require('child_process')

const FILE_TYPE = {
  FILE: 0,
  DIRECTORY: 1
}

module.exports = class extends Generator {
  _walkDirs = []

  _deleteFile() {
    console.log(this._walkDirs)
    this._walkDirs.forEach(filePath => {
      const { path, type } = filePath
      if (type === FILE_TYPE.DIRECTORY) {
        fs.rmdirSync(path)
      } else {
        fs.unlinkSync(filePath.path)
      }
      this.log(chalk.green(`${path}已删除成功`))
    })
  }

  _walk(basePath, recordDir = false) {
    const filenames = fs.readdirSync(basePath)
    if (filenames.length) {
      filenames.forEach(file => {
        const _path = path.join(basePath, file)
        try {
          if (fs.statSync(_path).isDirectory()) {
            this._walk(_path, recordDir)
            recordDir && this._walkDirs.push({ path: _path, type: FILE_TYPE.DIRECTORY })
          } else {
            this._walkDirs.push({ path: _path, type: FILE_TYPE.FILE })
          }
        } catch (error) {
          console.log('error = ', error)
          
        }
      })
    }
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the fine ${chalk.red('generator-my-bff')} generator!`)
    );
    this._walk(this.destinationPath(), true)

    const deleteConfirm = [{
      type: 'confirm',
      name: 'isDelete',
      message: '当前文件夹下有文件'
    }]

    const prompts = [
      {
        type: 'list',
        name: 'templateType',
        message: '请选择模板的类型',
        choices: ['typescript'],
        default: true
      }
    ];

    return this.prompt(deleteConfirm).then(({ isDelete }) => {
      if (isDelete) {
        this._deleteFile()

        return this.prompt(prompts).then((props) => {
          this.props = props;
        });
      } else {
        this.async()
        return Promise.reject()
      }
    }).then(() => {
      const templateName = this.props.templateType

      if (templateName === 'typescript') {
        try {
          this.log(chalk.green('开始拉取模板, 请等待.....'))
          const cloneRes = spawnSync('git', ['clone', `git@github.com:LaoChen1994/react-server-gen.git`])
          if (cloneRes.error) {
            this.log(`${chalk.red('git 拉取镜像错误')}: err -> ${err}`)
            return Promise.reject()
          }
          
          this.log(chalk.green('模板拉取成功！'))
        } catch (error) {
          this.log(chalk.red('未知错误, ', error))
        }
      }
    })
  }

  install() {
    this.log(chalk.yellow('开始安装依赖, 请等待'))
    const res = exec('cd ./react-server-gen && npm run dep:install', (err, stdout) => {
      if (err) {
        this.log(chalk.red('未知错误, error = ', error))
        return
      }

      console.log(stdout)
    })

    res.on('close', () => {
      this.log(chalk.green('依赖安装完成'))
    })
  }
};
