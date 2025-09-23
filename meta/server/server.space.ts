export default MetaFor("video", { dev: true })
  .context((types) => ({
    url: types.string.required("url")({ title: "Адрес видео" }),
    test: types.string.required("test"),
    timestampPlay: types.number.optional()({ title: "Время начала воспроизведения" }),
    timestampPause: types.number.optional()({ title: "Время паузы" }),
    timestampStop: types.number.optional()({ title: "Время остановки" }),
  }))
  .states({
    stop: {
      play: { timestampPlay: { null: false } },
    },
    play: {
      pause: { timestampPause: { null: false } },
      stop: { timestampStop: { null: false } },
    },
    pause: {
      play: { timestampPlay: { null: false } },
      stop: { timestampStop: { null: false } },
    },
  })
  .core()
  .processes((process) => ({
    stop: process({ title: "Запуск видео" })
      .action(async () => {
        await Bun.sleep(1000)
        return new Date().getTime()
      })
      .success(({ data, update }) => update({ timestampPlay: data })),
    play: process()
      .action(async ({ context }) => {
        console.log("PLAY")
        await Bun.sleep(1000)
        return {
          test: "test",
        }
      })
      .success(({ data, update }) => update({ timestampPlay: null })),
  }))
  .reactions((reaction) => [
    [
      ["play"],
      reaction()
        .filter({
          meta: "roadmap",
        })
        .equal(({ update, actor }) => {
          update({
            test: actor.index,
          })
        }),
    ],
  ])
  .view({
    render: ({ html, context }) => html`<video src="${context.url}" controls></video>`,
  })
document.body.innerHTML = `<meta-for></meta-for>`
