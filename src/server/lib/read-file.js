import { readFileSync } from 'fs'
import { resolve } from 'path'

export default function readFile(path) {
  return readFileSync(resolve(__dirname, path), 'utf8')
}
