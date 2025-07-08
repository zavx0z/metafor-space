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

import { join } from "node:path"
import { $ } from "bun"
import { readFile, writeFile, stat } from "node:fs/promises"
import { gzip } from "node:zlib"
import { promisify } from "node:util"
const gzipAsync = promisify(gzip)

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

// <=== Добавляем определения режима сборки и функцию генерации опций ===>

type BuildMode = "development" | "production"

/** Возвращает опции Bun.build в зависимости от режима. */
const getBuildOptions = (mode: BuildMode) => ({
  entrypoints: ["./metafor.ts"] as string[],
  outdir: join("."),
  target: "browser",
  format: "esm",
  sourcemap: mode === "development" ? "inline" : "none",
  define: {
    DEV_MODE: mode === "development" ? "true" : "false",
  },
  minify: mode === "production",
  drop: mode === "production" ? ["debugLogEvent"] : undefined,
})

/**
 * Выполняет сборку минифицированного JS и генерацию типов.
 * Выходные файлы помещаются в корневую директорию.
 * @param mode Режим сборки: "development" | "production"
 * @throws Ошибка, если сборка не удалась
 */
const build = async (mode: BuildMode = "development") => {
  const outDir = join(".")
  const start = Date.now()

  // 1. Сборка минифицированного JS с помощью Bun.build() API
  const buildResult = await Bun.build(getBuildOptions(mode) as any)

  if (!buildResult.success) {
    throw new Error("Сборка не удалась: " + buildResult.logs.join("\n"))
  }

  // 2. Генерация типов
  const isTTY = process.stdout.isTTY
  if (isTTY) {
    let spinnerActive = true
    const spinnerFrames = ["|", "/", "-", "\\"]
    let spinnerIndex = 0
    process.stdout.write("   ")
    const spinner = setInterval(() => {
      process.stdout.write(`\r${spinnerFrames[spinnerIndex++ % spinnerFrames.length]}  Генерация типов...`)
    }, 120)
    await $`dts-bundle-generator --out-file ${join(
      outDir,
      "metafor.d.ts"
    )} --export-referenced-types false ./metafor.ts`.quiet()
    spinnerActive = false
    clearInterval(spinner)
    process.stdout.write("\r✅ Типы успешно сгенерированы!           \n")
  } else {
    console.log("🛠️  Генерация типов...")
    await $`dts-bundle-generator --out-file ${join(
      outDir,
      "metafor.d.ts"
    )} --export-referenced-types false ./metafor.ts`.quiet()
    console.log("✅ Типы успешно сгенерированы!")
  }

  // 3. Информация о размерах файлов и версии
  console.log("🔍 Анализирую размеры файлов...")
  const jsPath = join(outDir, "metafor.js")
  const dtsPath = join(outDir, "metafor.d.ts")
  let jsSize = 0,
    dtsSize = 0,
    version = "",
    lastBundleSize = null
  try {
    jsSize = (await stat(jsPath)).size
    dtsSize = (await stat(dtsPath)).size
    let gzipSize = 0
    if (mode === "production") {
      const jsBuffer = await readFile(jsPath)
      const gzipped = await gzipAsync(jsBuffer)
      gzipSize = gzipped.length
      // Сохраняем gzip-файл только в production
      const gzipPath = jsPath + ".gz"
      await writeFile(gzipPath, gzipped)
      console.log(`💾 Сохранён gzip-файл: ${gzipPath}`)
    }
    const pkgPath = join(outDir, "package.json")
    const pkg = JSON.parse(await readFile(pkgPath, "utf-8"))
    version = pkg.version
    lastBundleSize = pkg.lastBundleSize
    // Сравнение размеров
    if (typeof lastBundleSize === "number") {
      const diff = jsSize - lastBundleSize
      const sign = diff > 0 ? "+" : diff < 0 ? "-" : ""
      const absDiff = Math.abs(diff) / 1024
      if (diff === 0) {
        // Размер не изменился
        if (mode === "production") {
          console.log(`📦 Бандл: metafor.js — ${(jsSize / 1024).toFixed(2)} КБ, gzip: ${(gzipSize / 1024).toFixed(2)} КБ`)
        } else {
          console.log(`📦 Бандл: metafor.js — ${(jsSize / 1024).toFixed(2)} КБ`)
        }
      } else {
        // Размер изменился
        if (mode === "production") {
          console.log(
            `📦 Бандл: metafor.js — ${sign}${absDiff.toFixed(2)} КБ (${(lastBundleSize / 1024).toFixed(2)} КБ → ${(
              jsSize / 1024
            ).toFixed(2)} КБ), gzip: ${(gzipSize / 1024).toFixed(2)} КБ`
          )
        } else {
          console.log(
            `📦 Бандл: metafor.js — ${sign}${absDiff.toFixed(2)} КБ (${(lastBundleSize / 1024).toFixed(2)} КБ → ${(
              jsSize / 1024
            ).toFixed(2)} КБ)`
          )
        }
      }
    }
    // Обновление lastBundleSize
    pkg.lastBundleSize = jsSize
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
  } catch (e) {
    // silent
  }
  const end = Date.now()
  console.log(`🔖 Версия пакета: ${version}`)
  // console.log(`📦 Бандл: ${jsPath} — ${(jsSize/1024).toFixed(2)} КБ`)
  console.log(`📑 Типы:  ${dtsPath} — ${(dtsSize / 1024).toFixed(2)} КБ`)
  console.log(`⏱️ Время сборки: ${(end - start) / 1000} сек.`)
}

/**
 * Обновляет версию, выполняет сборку, генерацию типов и публикует пакет.
 * Используется при запуске с ключом --publish или -p.
 */
const publish = async () => {
  const outDir = join(".")
  console.log("🔄 Обновляю версию и публикую пакет...")
  await updateVersion("./")
  await build("production")
  // 3. Публикация
  console.log("🚚 Публикация пакета...")
  const result = await $`bun publish`.text()
  // Ищем строку успешной публикации
  const match = result.match(/\+\s+(@?\S+@\d+\.\d+\.\d+)/)
  if (match) {
    console.log(`🎉 Пакет успешно опубликован: ${match[1]}`)
  } else {
    console.log("🎉 Пакет успешно опубликован.")
  }
}

let watcher: any = null

/**
 * Быстрая сборка JS в watch-режиме (без типов, без минификации, с sourcemap)
 */
const buildWatch = async () => {
  const outDir = join(".")
  console.log("👀 Watch mode: отслеживается только metafor.ts и его зависимости (быстрая сборка)")
  watcher = await Bun.build({
    entrypoints: ["./metafor.ts"],
    outdir: outDir,
    target: "browser",
    format: "esm",
    sourcemap: "inline",
    minify: false,
    define: { DEV_MODE: "true" },
    watch: {
      async onRebuild(error: unknown) {
        if (error) {
          console.error("❌ Ошибка пересборки:", error)
        } else {
          const size = (await stat(join(outDir, "metafor.js"))).size / 1024
          console.log(`🔄 metafor.js пересобран: ${size.toFixed(2)} КБ`)
        }
      },
    },
  } as any)
  if (watcher.success) {
    console.log(`✅ metafor.js собран: ${(await stat(join(outDir, "metafor.js"))).size / 1024} КБ`)
    console.log("⌛ Ожидание изменений metafor.ts и зависимостей... (Ctrl+C для выхода)")
  } else {
    console.error("❌ Ошибка сборки:", watcher.logs)
    process.exit(1)
  }
}

// --- CLI ---
if (import.meta.main) {
  const args = process.argv.slice(2)

  const isPublish = args.includes("--publish") || args.includes("-p")
  const isWatch = args.includes("--watch") || args.includes("-w")
  const mode: BuildMode = args.includes("--prod") || isPublish
    ? "production"
    : "development"

  try {
    if (isWatch) {
      await buildWatch()
    } else if (isPublish) {
      await publish() // внутри уже вызывается production-сборка
    } else {
      await build(mode)
    }
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
