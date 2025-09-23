export default MetaFor("messenger", { dev: false, persist: false })
  .context((t) => ({
    actorsQueue: t.array.required(/** @type {number[]} */ ([]))({ title: "Очередь акторов на создание" }),
  }))
  .states({})
  .core(
    // /**@type {import("./messenger.t.ts").Core} */ ({
    /**@type {any} */ ({
      socket: null,
      queueList: [],
      handler: () => {},
    })
  )
  .processes((process) => ({}))
  .reactions()
  .view(
    {
      onMount: ({ core }) => {
        core.handler = (/** @type {MessageEvent} */ event) => {
          // const data = /**@type {import("../../web/metafor.js").ActorData[]} */ (JSON.parse(event.data))
          // if (Object.hasOwn(data, "meta")) {
          //   log(data)
          // } else {
          const actors = []
          // for (const actor of data) {
          //   actors.push(actor.id)
          //   core.queueList.push({ id: actor.id, name: actor.snapshot.name })
          //   console.log(actor)
          // }
          // update({ actorsQueue: [...context.actorsQueue, ...actors] })
        }
      },
      // core.socket?.addEventListener("message", core.handler)
    }
    // onDestroy: ({ core }) => core.socket?.removeEventListener("message", core.handler),
  )
