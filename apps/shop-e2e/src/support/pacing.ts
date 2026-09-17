/**
 * Fixed per-test duration applied by the generated e2e specs.
 *
 * The benchmark wants every generated e2e test to take roughly the same,
 * predictable amount of wall-clock time. Each generated spec records when its
 * test started and calls padTo() at the end, which sleeps for whatever remains
 * of E2E_TEST_DURATION_MS (default 25000ms). Set E2E_TEST_DURATION_MS=0 to run
 * at full speed locally.
 */
export const DEFAULT_E2E_TEST_DURATION_MS = 25_000;

export function e2eTestDurationMs(): number {
  const raw = process.env['E2E_TEST_DURATION_MS'];
  if (raw === undefined || raw === '') {
    return DEFAULT_E2E_TEST_DURATION_MS;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : DEFAULT_E2E_TEST_DURATION_MS;
}

/** Sleep until `startedAt + E2E_TEST_DURATION_MS` has elapsed. */
export async function padTo(startedAt: number): Promise<void> {
  const remaining = startedAt + e2eTestDurationMs() - Date.now();
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
}
