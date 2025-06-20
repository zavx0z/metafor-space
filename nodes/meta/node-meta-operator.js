import {MetaFor} from "../../metafor.js"

export default MetaFor("node-meta-operator", {development: true})
  .states('init', 'ready')
  .context(t => ({
    title: t.string({title: "Название оператора", nullable: true}),
    value: t.string({title: "Значение", nullable: true}),
    symbol: t.enum("")({title: "Символ", nullable: true})
  }))
  .core(() =>/**@type{import("./node-meta-operator.t").Core}*/ ({
    data: undefined
  }))
  .view({
    render: ({context, html, state}) => state !== "ready" ? null : html`
      <span class="noselect">
          <span>${context.symbol}</span>
          <span>${context.title} - ${context.value}</span>
      </span>
    `
  })
  .transitions('init', [
    {
      in: "init",
      action({core, update}) {
        update({...core.data})
        core.data = undefined
      },
      to: [{
        state: "ready", when: {
          title: {isNull: false},
          value: {isNull: false}
        }
      }]
    }
  ])
  .create()


