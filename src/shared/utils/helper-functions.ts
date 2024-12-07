export function loopObject<
  T extends { [s: string]: unknown } | ArrayLike<unknown>
>(obj: T, callback: (key: keyof T, value: T[keyof T]) => void): void {
  Object.entries(obj).forEach(([key, value]) => {
    // @ts-ignore - We're safely working with keys and values here
    callback(key as keyof T, value)
  })
}
