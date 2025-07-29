import { $ } from "bun"

await $`bun run build:dev`.cwd("../metafor")
await $`cp -r ../metafor/dist/* .`
