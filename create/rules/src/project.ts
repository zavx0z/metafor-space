import { readFile } from "node:fs/promises"
import chalk from "chalk"

export const readPackageJson = async (path: string) => {
  try {
    return JSON.parse(await readFile(path, "utf-8"))
  } catch (error) {
    console.log(chalk.red("Не удалось прочитать package.json"))
    throw new Error("Не удалось прочитать package.json")
  }
}
