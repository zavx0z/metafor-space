#!/usr/bin/env node

import prompts from "prompts"
import chalk from "chalk"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import { readFile } from "node:fs/promises"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let version = "0.0.1"
try {
  const pkg = JSON.parse(await readFile(join(__dirname, "package.json"), "utf-8"))
  version = pkg.version
} catch (error) {
  console.warn("Не удалось прочитать версию из package.json")
}

async function init() {
  console.log(
    chalk.blue(`
    Create cursor rules v${version}
    ---------------------------
  `)
  )

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
