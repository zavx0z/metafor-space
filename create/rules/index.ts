#!/usr/bin/env node

import prompts from "prompts"
import chalk from "chalk"
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import { currentVersion } from "./src/version"
import { readPackageJson } from "./src/project"
import { MetaFor } from "../.."

const meta = MetaFor("rules")
  .states("информация о приложении", "данные от пользователя")
  .context((t) => ({
    version: t.string({ title: "версия приложения", nullable: true }),
    description: t.string({ title: "описание приложения", default: "Create cursor rules" }),
  }))
  .transitions([
    {
      from: "информация о приложении",
      action: "info",
      to: [{ state: "данные от пользователя", when: { version: { isNull: false } } }],
    },
  ])
  .core()
  .actions({
    info: async ({ context, update }) => {
      console.log(context)
    },
  })
  .create({
    state: "информация о приложении",
    onTransition: async (ctx) => {
      console.log(ctx)
    },
  })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function init() {
  const version = await currentVersion(__dirname)
  console.log(
    chalk.blue(`
    Create cursor rules v${version}
    ---------------------------
  `)
  )

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

init().catch((e) => {
  console.error(e)
  process.exit(1)
})
