/**
 * A minimal fake of the subset of the supabase-js query builder this
 * codebase actually uses (.select/.eq/.not/.order/.limit/.in/.maybeSingle/
 * .single), so repository functions can be tested against realistic
 * responses without a live database. Every chain method returns the same
 * thenable builder — awaiting it at any point in the chain resolves to
 * the configured `{ data, error }`, matching how these repository
 * functions actually call the client (a variable-length chain ending in
 * an implicit or explicit await).
 */
export interface MockResponse<T = unknown> {
  data: T;
  error: { message: string } | null;
}

export function mockQueryBuilder<T>(response: MockResponse<T>) {
  const builder: Record<string, unknown> = {};
  const chain = () => builder;
  const resolve = () => Promise.resolve(response);

  Object.assign(builder, {
    select: chain,
    eq: chain,
    not: chain,
    order: chain,
    limit: chain,
    in: chain,
    insert: chain,
    update: chain,
    delete: chain,
    upsert: chain,
    maybeSingle: resolve,
    single: resolve,
    then: (onFulfilled: (v: MockResponse<T>) => unknown, onRejected?: (e: unknown) => unknown) =>
      resolve().then(onFulfilled, onRejected),
  });

  return builder;
}

interface MockUser {
  id: string;
}

/**
 * `tableResponses` maps a table name to the response its query should
 * resolve to. `user` controls what `auth.getUser()` resolves to — pass
 * `null` for "no signed-in user," the codepath several functions check.
 */
export function mockSupabaseClient(tableResponses: Record<string, MockResponse>, user: MockUser | null = { id: "test-user-id" }) {
  return {
    from: (table: string) => mockQueryBuilder(tableResponses[table] ?? { data: [], error: null }),
    auth: {
      getUser: () => Promise.resolve({ data: { user } }),
    },
  };
}
