export type DataMetaMap = Map<string, {
  nodes: Record<string, {
    state: string
    width?: number
    height?: number
  }>,
  edges: Record<string, {
    from: string
    to: string
    width?: number
    height?: number
  }>
}>
