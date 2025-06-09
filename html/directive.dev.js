import {MetaFor} from "../metafor.js"

const meta = MetaFor("directive", {})
  .states("В работе", "На паузе", "Рефакторинг", "На тестировании", "Код-ревью")
  .context((t) => ({
    types: t.boolean({title: "Файл типов"}),
  }))
  .core(() => ({}))
  .transitions([
    {
      from: "В работе",
      action: () => console.log("В работе"),
      to: [{state: "Код-ревью", when: {types: true}}]
    },
  ])
  .view({
    render: ({html}) => html`
        <h1>Директивы</h1>
        <ul>
            ${["one", "two"].map(i => html`
                <li>
                    ${i}
                </li>
            `)}
        </ul>
    `
  })
  .create({
    state: "В работе",
    onUpdate: (value) => {
      console.log(value)
    },
    onTransition: (oldState, newState) => {
      console.log(oldState, newState)
    },
  })

meta.update({types: true})
