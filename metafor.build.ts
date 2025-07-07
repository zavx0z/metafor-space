/**
 * Скрипт сборки, генерации типов и публикации пакета.
 * 
 * По умолчанию выполняет только сборку и генерацию типов.
 * Если передан ключ --publish или -p, дополнительно обновляет версию и публикует пакет.
 * 
 * Использование:
 *   bun metafor.build.ts           // только сборка и генерация типов
 *   bun metafor.build.ts --publish // обновление версии, сборка, генерация типов, публикация
 *   bun metafor.build.ts -p        // то же самое, что и --publish
 */

import { join } from 'node:path'
import { $ } from 'bun'
import { readFile, writeFile, stat } from "node:fs/promises"

/**
 * Обновляет patch-версию в package.json в указанной директории.
 * @param path Путь к директории с package.json
 */
export const updateVersion = async (path: string) => {
  const packageJson = JSON.parse(await readFile(join(path, "package.json"), "utf-8"))
  console.log(`📝 Текущая версия: ${packageJson.version}`)
  
  const version = packageJson.version.split(".").map(Number)
  version[2]++
  packageJson.version = version.join(".")
  
  console.log(`🚀 Новая версия: ${packageJson.version}`)
  await writeFile(join(path, "package.json"), JSON.stringify(packageJson, null, 2))
}

/**
 * Выполняет сборку минифицированного JS и генерацию типов.
 * Выходные файлы помещаются в корневую директорию.
 * @throws Ошибка, если сборка не удалась
 */
const build = async () => {
  const outDir = join('.')
  const start = Date.now()

  // 1. Сборка минифицированного JS с помощью Bun.build() API
  console.log('⚙️  Начинаю сборку...')
  const buildResult = await Bun.build({
    entrypoints: ['./metafor.ts'],
    outdir: outDir,
    target: 'browser',
    format: 'esm',
    minify: true
  })

  if (!buildResult.success) {
    throw new Error('Сборка не удалась: ' + buildResult.logs.join('\n'))
  }

  // 2. Генерация типов
  console.log('🛠️  Генерирую типы...')
  let spinnerActive = true
  const spinnerFrames = ['|', '/', '-', '\\']
  let spinnerIndex = 0
  process.stdout.write('   ')
  const spinner = setInterval(() => {
    process.stdout.write(`\r${spinnerFrames[spinnerIndex++ % spinnerFrames.length]}  Генерация типов...`)
  }, 120)
  await $`dts-bundle-generator --out-file ${join(outDir, 'metafor.d.ts')} --export-referenced-types false ./metafor.ts`.quiet()
  spinnerActive = false
  clearInterval(spinner)
  process.stdout.write('\r✅ Типы успешно сгенерированы!           \n')

  // 3. Информация о размерах файлов и версии
  console.log('🔍 Анализирую размеры файлов...')
  const jsPath = join(outDir, 'metafor.js')
  const dtsPath = join(outDir, 'metafor.d.ts')
  let jsSize = 0, dtsSize = 0, version = '', lastBundleSize = null
  try {
    jsSize = (await stat(jsPath)).size
    dtsSize = (await stat(dtsPath)).size
    const pkgPath = join(outDir, 'package.json')
    const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'))
    version = pkg.version
    lastBundleSize = pkg.lastBundleSize
    // Сравнение размеров
    if (typeof lastBundleSize === 'number') {
      const diff = jsSize - lastBundleSize
      const sign = diff > 0 ? '+' : diff < 0 ? '-' : ''
      const absDiff = Math.abs(diff) / 1024
      if (diff === 0) {
        console.log('📦 Размер бандла не изменился.')
      } else {
        console.log(`📦 Размер бандла изменился: ${sign}${absDiff.toFixed(2)} КБ (${(lastBundleSize/1024).toFixed(2)} КБ → ${(jsSize/1024).toFixed(2)} КБ)`)
      }
    }
    // Обновление lastBundleSize
    pkg.lastBundleSize = jsSize
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  } catch (e) {
    // silent
  }
  const end = Date.now()
  console.log(`🔖 Версия пакета: ${version}`)
  console.log(`📦 Бандл: ${jsPath} — ${(jsSize/1024).toFixed(2)} КБ`)
  console.log(`📑 Типы:  ${dtsPath} — ${(dtsSize/1024).toFixed(2)} КБ`)
  console.log(`⏱️  Время сборки: ${(end - start)/1000} сек.`)
}

/**
 * Обновляет версию, выполняет сборку, генерацию типов и публикует пакет.
 * Используется при запуске с ключом --publish или -p.
 */
const publish = async () => {
  const outDir = join('.')
  console.log('🔄 Обновляю версию и публикую пакет...')
  await updateVersion("./")
  await build()
  // 3. Публикация
  console.log('🚚 Публикация пакета...')
  const result = await $`bun publish`.text()
  // Ищем строку успешной публикации
  const match = result.match(/\+\s+(@?\S+@\d+\.\d+\.\d+)/)
  if (match) {
    console.log(`🎉 Пакет успешно опубликован: ${match[1]}`)
  } else {
    console.log('🎉 Пакет успешно опубликован.')
  }
}

/**
 * Точка входа скрипта. Определяет режим работы по аргументам командной строки.
 * Без аргументов — только сборка и генерация типов.
 * С ключом --publish или -p — обновление версии, сборка, генерация типов и публикация.
 */
if (import.meta.main) {
  const args = process.argv.slice(2)
  if (args.includes('--publish') || args.includes('-p')) {
    // Публикация с обновлением версии
    try {
      await publish()
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  } else {
    // Только сборка и генерация типов
    try {
      await build()
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }
}