import {describe, it, expect} from "bun:test"
import ELK from "../lib/elk-api.js"

describe("Server Worker", () => {
  it("dev", async () => {
    const elk = new ELK({
      workerUrl: "./lib/elk-worker.js"
    })
    const graph = {
      id: "root",
      layoutOptions: {"elk.algorithm": "layered"},
      children: [
        {id: "n1", width: 30, height: 30},
        {id: "n2", width: 30, height: 30},
        {id: "n3", width: 30, height: 30}
      ],
      edges: [
        {id: "e1", sources: ["n1"], targets: ["n2"]},
        {id: "e2", sources: ["n1"], targets: ["n3"]}
      ]
    }

    const result = await elk.layout(graph)
    expect(result).toBeDefined()
  })

  it("prod", async () => {
    const elk = new ELK({
      workerUrl: "./lib/elk-worker.min.js"
    })
    const graph = {
      id: "root",
      layoutOptions: {"elk.algorithm": "layered"},
      children: [
        {id: "n1", width: 30, height: 30},
        {id: "n2", width: 30, height: 30},
        {id: "n3", width: 30, height: 30}
      ],
      edges: [
        {id: "e1", sources: ["n1"], targets: ["n2"]},
        {id: "e2", sources: ["n1"], targets: ["n3"]}
      ]
    }

    const result = await elk.layout(graph)
    expect(result).toBeDefined()
  })
})
