// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="cordova-plugin-file" />

export class CordovaError extends Error { }

export default class Filesystem {
  supports!: boolean;

  constructor() {
    if (typeof window.requestFileSystem !== 'function') {
      console.log('Cordova file plugin is not detected!')
    }

    this.supports = typeof window.requestFileSystem === 'function'
  }

  public async readCache(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.supports) {
        return reject(new CordovaError())
      }

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs: FileSystem) => {
        console.log('file system open: ' + fs.name)
        fs.root.getFile('cache.txt', { create: true, exclusive: false }, (fileEntry) => {
          console.log('fileEntry is file?', fileEntry)

          resolve(this.readFile(fileEntry))
        }, reject)
      }, reject)
    })
  }

  public async writeCache(data: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.supports) {
        return reject(new CordovaError())
      }

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs: FileSystem) => {
        console.log('file system open: ' + fs.name)
        fs.root.getFile('cache.txt', { create: true, exclusive: false },  (fileEntry) => {
          console.log('fileEntry is file?', fileEntry)

          resolve(this.writeFile(fileEntry, data))
        }, reject)
      }, reject)
    })
  }

  private writeFile(fileEntry: FileEntry, data: string): Promise<void> {
    return new Promise<void>(((resolve, reject) => {
      fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function() {
          console.log('Successful file write...')
          resolve()
        }

        fileWriter.onerror = function (e) {
          console.log('Failed file write: ' + e.toString())
          reject()
        }

        fileWriter.write(new Blob([data], { type: 'text/plain' }))
      })
    }))
  }

  private readFile(fileEntry: FileEntry): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fileEntry.file(function (file) {
        const reader = new FileReader()

        reader.onloadend = function() {
          console.log('Successful file read: ', this.result)
          resolve(this.result as string)
        }

        reader.readAsText(file)
      }, reject)
    })
  }
}