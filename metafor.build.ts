// import { rmSync, mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { $ } from 'bun'

const outDir = join('.')
// const outDir = join('..', 'space', 'lib')

// if (existsSync(outDir)) {
//   rmSync(outDir, { recursive: true, force: true })
// }
// mkdirSync(outDir, { recursive: true })

// 1. Сборка минифицированного JS
await $`bun build ./metafor.ts --outdir ${outDir} --target browser --format esm --minify`

// 2. Генерация объединённого .d.ts, экспорт только MetaFor
await $`dts-bundle-generator --out-file ${join(outDir, 'metafor.d.ts')} --export-referenced-types false ./metafor.ts`

// 3. Переименовываем JS в index.js и создаём index.d.ts с реэкспортом (опционально)
// writeFileSync(join(outDir, 'index.js'), "export { MetaFor } from './metafor.js'\n")
// writeFileSync(join(outDir, 'index.d.ts'), "export { MetaFor } from './metafor.js'\n") 