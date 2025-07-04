import {rmdir, mkdir} from "node:fs/promises"

try {
  await rmdir("./public", {recursive: true})
} catch (error) {
  await mkdir("./public", {recursive: true})
}

await Bun.build({
  entrypoints: ['./index.html', "./graph/lib/elk-api.js", "./graph/lib/elk-worker.min.js"],
  outdir: './public',
  target: "browser",
  external: ["elkjs", "/theme/RussoOne-Regular.woff2"],
  naming: "[dir]/[name].[ext]",
  minify: true
})
