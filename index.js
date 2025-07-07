import { MetaFor } from "@metafor/space"

const {context, update} = MetaFor("roadmap", {description: "MetaFor RoadMap", development: false})
  .context((t) => ({
    status: t.enum("start", "process", "end").required({title: "Статус", default: "start"}),
    error: t.string.optional({title: "Ошибка", nullable: true})
  }))

  console.log(context)
  setTimeout(()=>{
    update({status: "process"})
    console.log(context)
  }, 1000)