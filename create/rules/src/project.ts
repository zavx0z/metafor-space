import { readFile } from "node:fs/promises"
import chalk from "chalk"

export const readPackageJson = async (path: string) => {
  try {
    const pkg = JSON.parse(await readFile(path, "utf-8"))
    return pkg
  } catch (error) {
    console.log(chalk.red("Не удалось прочитать package.json"))
    process.exit(1)
  }
}
