#!/usr/bin/env node

import prompts from "prompts"
import chalk from "chalk"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { currentVersion } from "./src/version"
import { readPackageJson } from "./src/project"
import { MetaFor } from "../.."

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const meta = MetaFor("rules")
  .states(
    "получение версии create-rules",
    "вывод приветственного сообщения",

    "поиск package.json",
    "вывод данных о проекте",
    "ошибка чтения package.json",

    "поиск сгенерированных правил",
    "правила удалены",
    "ошибка удаления правил",

    "поиск директории с правилами",
    "директория с правилами найдена",
    "создание директории правил",

    "данные от пользователя",
    "генерация правил",
    "правила сгенерированы",
    "ошибка генерации правил",

    "подписка на отмену",
    "отмена пользователем"
  )
  .context((t) => ({
    version: t.string({ title: "версия create-rules", nullable: true }),
    description: t.string({ title: "описание create-rules", default: "Create cursor rules" }),

    projectName: t.string({ title: "имя проекта", nullable: true }),
    packageJsonPath: t.string({ title: "путь к package.json", default: "./package.json" }),
    cancel: t.boolean({ title: "отмена", nullable: true }),
    error: t.string({ title: "ошибка", nullable: true }),
  }))
  .transitions([
    {
      from: "подписка на отмену",
      action: "subscribeCancel",
      to: [{ state: "получение версии create-rules", when: { cancel: false } }],
    },
    {
      from: "отмена пользователем",
      action: "cancel",
      to: [{ state: "отмена пользователем", when: { cancel: true } }],
    },
    {
      from: "получение версии create-rules",
      action: "readVersion",
      to: [
        { state: "вывод приветственного сообщения", when: { version: { isNull: false } } },
        { state: "отмена пользователем", when: { cancel: true } },
      ],
    },
    {
      from: "вывод приветственного сообщения",
      action: async ({ context, update }) => {
        console.log(
          chalk.blue(`
          Create cursor rules v${context.version}
          ---------------------------
        `)
        )
      },
      to: [{ state: "поиск package.json", when: { error: null } }],
    },
    {
      from: "поиск package.json",
      action: "readPackageJson",
      to: [
        { state: "вывод данных о проекте", when: { error: null } },
        { state: "ошибка чтения package.json", when: { error: { isNull: false } } },
      ],
    },
    {
      from: "вывод данных о проекте",
      action: "logProjectInfo",
      to: [
        { state: "поиск сгенерированных правил", when: { error: null } },
        { state: "ошибка чтения package.json", when: { error: { isNull: false } } },
      ],
    },
    {
      from: "данные от пользователя",
      action: "logUserInfo",
      to: [{ state: "генерация правил", when: { error: null } }],
    },
  ])
  .core(({ context, update }) => ({
    packageJson: /** @type {Buffer} */ undefined,
  }))
  .actions({
    subscribeCancel: ({ update }) => {
      process.on("SIGINT", () => {
        update({ cancel: true })
        process.exit(0)
      })
      process.on("SIGTERM", () => {
        update({ cancel: true })
        process.exit(0)
      })
      update({ cancel: false })
    },
    readVersion: async ({ context, update }) => {
      try {
        const version = await currentVersion(__dirname)
        update({ version })
      } catch (error) {
        update({ error: (error as Error).message })
      }
    },
    readPackageJson: async ({ context, update, core }) => {
      try {
        const packageJson = await readPackageJson(join(__dirname, context.packageJsonPath))
        update({ projectName: packageJson.name })
        core.packageJson = packageJson
      } catch (error) {
        update({ error: (error as Error).message })
      }
    },
    logProjectInfo: async ({ context }) => {
      console.log(chalk.green(`Project name: ${context.projectName}`))
    },
    logUserInfo: async ({ context, update, core }) => {
      console.log(chalk.green(`Success: ${context.error}`))
    },
  })
  .create({
    state: "подписка на отмену",
    onUpdate: (value) => {
      // console.log(`Update: ${{ ...value }}`)
      console.table(value)
    },
    onTransition: async (prev, next, meta) => {
      console.log(`Transition: ${prev} -> ${next}`)
      if (next === "отмена пользователем") {
        meta?.destroy()
      }
    },
  })

async function init() {
  const version = await currentVersion(__dirname)

  // const pkg = await readPackageJson(__dirname)
  // console.log(pkg)

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
        { title: "Basic", value: "basic" },
        { title: "TypeScript", value: "typescript" },
      ],
    },
  ])

  console.log(chalk.green("\nCreating your Rules app..."))
  console.log(`\nTemplate: ${response.template}`)
  console.log(`Directory: ${response.projectName}`)
}

// init().catch((e) => {
//   console.error(e)

//   process.exit(1)
// })
