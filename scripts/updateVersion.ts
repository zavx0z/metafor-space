import { join } from "node:path"
import { readFile, writeFile } from "node:fs/promises"

export const updateVersion = async (path: string) => {
  const packageJson = JSON.parse(await readFile(join(path, "package.json"), "utf-8"))
  console.log(`Current version: ${packageJson.version}`)
  const version = packageJson.version.split(".").map(Number)
  version[2]++
  packageJson.version = version.join(".")
  console.log(`New version: ${packageJson.version}`)
  await writeFile(join(path, "package.json"), JSON.stringify(packageJson, null, 2))
}

if (import.meta.main) {
  const path = process.argv[2]

  if (!path) {
    console.error("Не указан путь к папке с package.json")
    process.exit(1)
  }

  try {
    await updateVersion(path)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
