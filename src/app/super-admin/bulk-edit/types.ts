export type ChangeMap = Record<string, Partial<userT>>

export type OnBlurChange = (
  _id: string,
  path: string,
  value: string | number | boolean | undefined,
) => void
