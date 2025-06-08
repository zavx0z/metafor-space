import {MetaFor} from "../../metafor.js";

MetaFor("node", {development: true, description: "Node"})
  .states("hide", "visible")
  .context(t => ({
    redy: t.boolean({title: "Готов к отображению"})
  }))
  .core(() => ({}))
  .transitions([
    {
      from: "hide",
      to: [{state: "visible", when: {redy: true}}]
    },
    {
      from: "visible",
      to: [{state: "hide", when: {redy: false}}]
    }
  ])
  .view({
    render: ({html}) => {
      return html``
    }
  })
  .create({
    state: "visible",
    context: {
      redy: true
    }
  })