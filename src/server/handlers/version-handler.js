import readFile from '../lib/read-file'

export default function fromFile() {
  try {
    const content = readFile('../../../version.json')
    return JSON.parse(content)
  } catch (err) {
    if (err.code === 'ENOENT' && err.errno === -2 && err.syscall === 'open') {
      return err.message
    }
    throw err
  }
}
