
export async function authGuard<
  T extends any[], // any args except token
  R
>(
  user: any,
  token: string | null,
  action: (token: string, ...args: T) => Promise<R>,
  ...args: T
): Promise<R> {
  if (!user || !token) {
    throw new Error("Not authenticated.");
  }
  return await action(token, ...args);
}
