import { join } from "node:path"
import { readFile } from "node:fs/promises"

export const currentVersion = async (path: string) => {
  try {
    const pkg = JSON.parse(await readFile(join(path, "package.json"), "utf-8"))
    return pkg.version
  } catch (error) {
    console.warn("Не удалось прочитать версию из package.json")
    return null
  }
}
