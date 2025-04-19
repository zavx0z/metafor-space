import { MetaFor } from "../index.js"

const nodes = MetaFor("nodes", {
  description: "Nodes",
  development: true,
})
  .states("начало", "конец")
  .context((t) => ({
    status: t.enum("start", "end")({ title: "Status", default: "start" }),
  }))
  .core()
  .transitions([
    {
      from: "начало",
      action: ({ context }) => {
        console.log(context)
      },
      to: [
        {
          state: "конец",
          when: { status: "end" },
        },
      ],
    },
  ])
  .view({
    render: ({ html, update }) => html`
    <div>
      <h1>Nodes</h1>
      <button @click=${() => update({ status: "end" })}>End</button>
    </div>
    `,
    style: ({ css }) => css`
      h1 {
        color: red;
      }
    `,
  })
  .create({
    state: "начало",
    onTransition: (preview, current, meta) => {
      console.log(meta.id, preview, current)
    },
  })
