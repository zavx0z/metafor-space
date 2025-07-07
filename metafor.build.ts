// import { rmSync, mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { $ } from 'bun'
import { readFile, writeFile } from "node:fs/promises"

// Обновление версии пакета
export const updateVersion = async (path: string) => {
  const packageJson = JSON.parse(await readFile(join(path, "package.json"), "utf-8"))
  console.log(`Current version: ${packageJson.version}`)
  
  const version = packageJson.version.split(".").map(Number)
  version[2]++
  packageJson.version = version.join(".")
  
  console.log(`New version: ${packageJson.version}`)
  await writeFile(join(path, "package.json"), JSON.stringify(packageJson, null, 2))
}

// Основная функция сборки
const build = async () => {
  const outDir = join('.')

  // 1. Сборка минифицированного JS с помощью Bun.build() API
  const buildResult = await Bun.build({
    entrypoints: ['./metafor.ts'],
    outdir: outDir,
    target: 'browser',
    format: 'esm',
    minify: true
  })

  if (!buildResult.success) {
    throw new Error('Build failed: ' + buildResult.logs.join('\n'))
  }

  // 2. Генерация типов
  await $`dts-bundle-generator --out-file ${join(outDir, 'metafor.d.ts')} --export-referenced-types false ./metafor.ts`

  // 3. Публикация
  const result = await $`bun publish`.text()
  console.log(result)
}

// Точка входа
if (import.meta.main) {
  try {
    await updateVersion("./")
    await build()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}