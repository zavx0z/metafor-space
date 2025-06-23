export type DataMetaMap = Map<string, {
  nodes: Record<string, {
    state: string
  }>,
  edges: Record<string, {
    from: string
    to: string
  }>
}>
