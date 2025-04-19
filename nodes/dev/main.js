import { MetaFor } from "../../index.js"
import { Nodes } from "../nodes.js"

const nodes = Nodes.create({
  state: "ожидание патча",
})

const meta = MetaFor("nodes", {
  description: "Nodes",
  development: false,
})
  .states("начало", "конец")
  .context((t) => ({
    status: t.enum("start", "end")({ title: "Status", default: "start" }),
  }))
  .core(() => ({
  }))
  .transitions([
    {
      from: "начало",
      action: ({ context }) => {
        console.log(context)
      },
      to: [
        {
          state: "конец",
          when: {
            status: "start",
          },
        },
      ],
    },
    {
      from: "конец",
      action: async () => {
        console.log("конец")
      },
      to: [
        {
          state: "начало",
          when: {
            status: "end",
          },
        },
      ],
    },
  ])
  .create({
    state: "начало",
    onTransition: (preview, current, meta) => {
      console.log(preview, current, meta)
    },
    onUpdate: (value) => {
      console.log(value)
    },
  })
