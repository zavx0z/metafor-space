import {html} from "../html/html.js"

/**
 * @param {import("../metafor").Snapshot<any, any, any>} snapshot
 * @param {MetaAny} instance
 */
export const template = (snapshot, instance) => {
  return html`
    <metafor-graph-meta context=${{
      id: snapshot.id,
      description: snapshot.description
    }}>
      ${snapshot.states.map(i => html`
        <metafor-graph-state core=${{meta: instance}} context=${{
          id: snapshot.id,
          state: i
        }}>
          ${snapshot.transitions.map((transition) => transition.to
            .filter(t => t.state === i)
            .map(condition =>
              Object.entries(condition.when).map(([key, value]) => {
                let op
                let val
                if (typeof value === "object" && value !== null) {
                  return html`
                    <metafor-graph-condition context=${{
                      id: snapshot.id,
                      from: transition.in,
                      to: condition.state,
                      param: key,
                      type: snapshot.types[key].type
                    }}> ${html`${Object.entries(/**@param{[string, string]} param*/([key, value]) => html`
                      <metafor-graph-operator context=${{
                        id: snapshot.id,
                        from: transition.in,
                        to: condition.state,
                        op: key,
                        value: value
                      }}>
                      </metafor-graph-operator>`)}
                    </metafor-graph-condition>`}`
                } else if (value === null) {
                  op = "isNull"
                  value = true
                } else {
                  op = "eq"
                  val = value
                }
                return html`
                  <metafor-graph-condition context=${{
                    id: snapshot.id,
                    from: transition.in,
                    to: condition.state,
                    param: key,
                    type: snapshot.types[key].type
                  }}
                  >
                    <metafor-graph-operator context=${{
                      id: snapshot.id,
                      from: transition.in,
                      to: condition.state,
                      op: op,
                      value: val
                    }}>
                    </metafor-graph-operator>
                  </metafor-graph-condition>
                `
              })))}
          <metafor-graph-context .core=${{meta: instance}} context=${{
            id: snapshot.id,
            state: i
          }}>
            ${Object.keys(snapshot.types).map(key => html`
              <metafor-graph-param
                .core=${{meta: instance}}
                context=${{
                  id: snapshot.id,
                  state: i,
                  param: key,
                  title: snapshot.types[key].title,
                  value: snapshot.context[key],
                  options: snapshot.types[key].type === 'enum' ? snapshot.types[key].values : [],
                  type: snapshot.types[key].type
                }}
              ></metafor-graph-param>
            `)}
          </metafor-graph-context>
        </metafor-graph-state>
      `)}
    </metafor-graph-meta>
  `
}