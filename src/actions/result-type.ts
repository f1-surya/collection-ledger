export type ActionResult<T = void> =
  | (T extends void ? { success: true } : { success: true; data: T })
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
