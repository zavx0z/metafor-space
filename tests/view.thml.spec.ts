import { describe, it, expect } from "bun:test"
import { MetaFor } from "../index"

describe("View", () => {
    const particle = MetaFor("test-particle")
    .states("initial", "loading", "loaded", "error")
    .context((types) => ({
        data: types.string({title: "Data", default: "Hello, world!"}),
    }))
    .transitions([
        
    ])
    
    
    it("should render", () => {
        expect(true).toBe(true)
    })
})
