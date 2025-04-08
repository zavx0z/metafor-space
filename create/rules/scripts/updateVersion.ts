import packageJson from "../package.json" with { type: "json" }

console.log(packageJson.version)

const version = packageJson.version.split(".").map(Number)

version[2]++

packageJson.version = version.join(".")

console.log(packageJson.version)

await Bun.write("./package.json", JSON.stringify(packageJson, null, 2))