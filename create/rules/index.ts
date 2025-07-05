#!/usr/bin/env node

import prompts from "prompts"
import chalk from "chalk"
import {fileURLToPath} from "node:url"
import {dirname, join} from "node:path"
import {currentVersion} from "./src/version"
import {readPackageJson} from "./src/project"
import {MetaFor} from "../.."
import {existsSync, mkdirSync, rmSync} from "node:fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

MetaFor("rules", {
  development: import.meta.env["npm_lifecycle_script"] === "bun run index.ts",
  description: /**markdown */ `
  - Создание правил из типов и TypeDoc описаний в пакете.
  - Объединяет все типы в один файл .mc в директории .cursor/rules/
  - Добавляет в начало файла комментарий с описанием правил.
  - Включает код из файлов в TypeDoc описаниях.
  `,
})
  .states(
    "получение версии create-rules",
    "вывод приветственного сообщения",

    "поиск package.json",
    "вывод данных о проекте",
    "ошибка чтения package.json",

    "поиск директории с правилами",
    "создание директории правил",
    "ошибка создания директории правил",

    "поиск сгенерированных правил",
    "правила найдены и удалены",
    "ошибка удаления правил",

    "данные от пользователя",
    "генерация правил",
    "правила сгенерированы",
    "ошибка генерации правил",

    "подписка на отмену",
    "отмена пользователем",
    "завершение работы"
  )
  .context((t) => ({
    version: t.string({title: "версия create-rules", nullable: true}),
    description: t.string({title: "описание create-rules", default: "Create cursor rules"}),

    projectName: t.string({title: "имя проекта", nullable: true}),
    packageJsonPath: t.string({title: "путь к package.json", default: "./package.json"}),
    rulesPath: t.string({title: "путь к правилам", default: "./.cursor/rules"}),
    rulePath: t.string({title: "путь к правилу", nullable: true}),
    cancel: t.boolean({title: "отмена", nullable: true}),
    error: t.string({title: "ошибка", nullable: true}),
  }))
  .core(() => ({
    packageJson: /** @type {Object} */ undefined,
  }))
  .transitions("подписка на отмену", [
    {
      in: "подписка на отмену",
      action: ({update}) => {
        process.on("SIGINT", () => {
          update({cancel: true})
          process.exit(0)
        })
        process.on("SIGTERM", () => {
          update({cancel: true})
          process.exit(0)
        })
        update({cancel: false})
      },
      to: {
        "получение версии create-rules": {cancel: false},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      in: "получение версии create-rules",
      action: async ({update}) => {
        try {
          const version = await currentVersion(__dirname)
          update({version})
        } catch (error) {
          update({error: (error as Error).message})
        }
      },
      to: {
        "вывод приветственного сообщения": {version: {isNull: false}},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      in: "вывод приветственного сообщения",
      action: async ({context, update}) => {
        console.log(
          chalk.blue(`
          Create cursor rules v${context.version}
          ---------------------------
        `)
        )
      },
      to: {"поиск package.json": {error: null}},
    },
    {
      in: "поиск package.json",
      action: async ({context, update, core}) => {
        try {
          const packageJson = await readPackageJson(join(__dirname, context.packageJsonPath))
          update({projectName: packageJson.name})
          core.packageJson = packageJson
        } catch (error) {
          update({error: (error as Error).message})
        }
      },
      to: {
        "вывод данных о проекте": {error: null},
        "ошибка чтения package.json": {error: {isNull: false}},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      in: "вывод данных о проекте",
      action: ({context}) => console.log(chalk.green(`Project name: ${context.projectName}`)),
      to: {
        "поиск сгенерированных правил": {error: null},
        "ошибка чтения package.json": {error: {isNull: false}},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      from: "поиск директории с правилами",
      action: ({context, update}) => {
        const rulesPath = join(__dirname, context.rulesPath)
        if (existsSync(rulesPath)) {
          console.log(chalk.green("Директория с правилами найдена"))
          update({rulesPath})
        } else {
          update({error: "Директория с правилами не найдена"})
        }
      },
      to: {
        "создание директории правил": {rulesPath: {isNull: true}},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      from: "создание директории правил",
      action: ({context, update}) => {
        mkdirSync(context.rulesPath, {recursive: true})
        console.log(chalk.green("Директория с правилами создана"))
        update({rulesPath: context.rulesPath})
      },
      to: {
        "поиск сгенерированных правил": {rulesPath: {isNull: false}},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      from: "поиск сгенерированных правил",
      action: ({context, update}) => {
        console.log(chalk.green("Поиск сгенерированных правил"))
        const rulePath = join(context.rulesPath, `${context.projectName}.mc`)
        if (existsSync(rulePath)) {
          update({rulePath})
        } else {
          update({error: `Правила не найдены: ${rulePath}`})
        }
      },
      to: {
        "правила найдены и удалены": {rulePath: {isNull: false}},
        "ошибка удаления правил": {error: {isNull: false}},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      from: "правила найдены и удалены",
      action: ({context}) => {
        rmSync(context.rulePath, {force: true})
        console.log(chalk.green("Обновление правил..."))
      },
      to: {
        "генерация правил": {error: null},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      from: "ошибка удаления правил",
      action: ({context, update}) => {
        console.log(chalk.red(`Ошибка удаления правил: ${context.error}`))
        update({error: null})
      },
      to: {},
    },
    {
      from: "генерация правил",
      action: () => {
        console.log(chalk.green("Генерация правил..."))
      },
      to: {
        "правила сгенерированы": {error: null},
        "ошибка генерации правил": {error: {isNull: false}},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      from: "правила сгенерированы",
      action: () => {
        console.log(chalk.green("Правила сгенерированы"))
      },
      to: {
        "завершение работы": {error: null},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      from: "ошибка генерации правил",
      action: ({context}) => {
        console.log(chalk.red(`Ошибка генерации правил: ${context.error}`))
      },
      to: {
        "завершение работы": {error: null},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      from: "данные от пользователя",
      to: {
        "генерация правил": {error: null},
        "отмена пользователем": {cancel: true}
      },
    },
    {
      from: "отмена пользователем",
      action: () => {
        console.log(chalk.red("Отмена выполнения create-rules пользователем."))
      },
      to: {"завершение работы": {cancel: true}},
    },
    {
      from: "завершение работы",
      action: ({core}) => {
        core.packageJson = undefined
        // core.destroy()
        process.exit(0)
      },
      to: {},
    },
  ])
  // .view({
  //   render: ({html, context}) => html`
  //   <div>
  //     <h1>Create cursor rules</h1>
  //     <p>Version: ${context.version}</p>
  //     <p>Project name: ${context.projectName}</p>
  //   </div>
  //   `
  // })
  .create({
    onUpdate: (value) => {
      // console.log(`Update: ${{ ...value }}`)
      console.table(value)
    },
    onTransition: async (prev, next, meta) => {
      console.log(`Transition: ${prev} -> ${next}`)
      if (next === "отмена пользователем") {
        // meta?.destroy()
      }
    },
  })

async function init() {
  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Where would you like to create your rules?",
      initial: "my-rules-app",
    },
    {
      type: "select",
      name: "template",
      message: "Choose a template",
      choices: [
        {title: "Basic", value: "basic"},
        {title: "TypeScript", value: "typescript"},
      ],
    },
  ])

  console.log(chalk.green("\nCreating your Rules app..."))
  console.log(`\nTemplate: ${response.template}`)
  console.log(`Directory: ${response.projectName}`)
}
