export type Primitive = null | undefined | boolean | number | string | symbol | bigint

export const TemplateResultType = {
  HTML: 1,
  SVG: 2,
  MATHML: 3
}

export type TemplateResultType = (typeof TemplateResultType)[keyof typeof TemplateResultType]

