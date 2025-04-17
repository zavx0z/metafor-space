import { MetaFor } from "../../index.js"
import ELK from "elkjs"

const elk = new ELK()

const meta = MetaFor("nodes", {
  description: "Nodes",
  development: false,
})
  .states("начало", "конец")
  .context((t) => ({
    status: t.enum("start", "end")({ title: "Status", default: "start" }),
  }))
  .transitions([
    {
      from: "начало",
    //   action: async () => {
    //     console.log("начало")
    //   },
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
  .core()
  .actions({})
  .create({
    state: "начало",
    onTransition: (preview, current, meta) => {
      console.log(preview, current, meta)
    },
    onUpdate: (value) => {
      console.log(value)
    },
  })
