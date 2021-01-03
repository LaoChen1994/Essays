import fs from 'fs'
import path from 'path'

export const importAllFile = <T>(targetPath: string, regx: RegExp = /.(t|j)s$/, store: Promise<T>[] = []): Promise<Promise<T>[]> => {
    const requireList: Promise<T>[] = store ? store : []

    return new Promise((resolve, reject) => {
        fs.readdir(targetPath, (err, files) => {
            if (err) {
                reject(err)
            }
    
            files.map(filePath => {
                if (regx.test(filePath)) {
                    requireList.push(require(path.join(targetPath, filePath)))
                } else {
                    if (fs.statSync(targetPath + filePath).isDirectory()) {
                        importAllFile(path.join(targetPath, filePath), regx, requireList)
                    }
                }
            })

            resolve(requireList)
        })
    })
}
