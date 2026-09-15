/**
 * Fixed per-test delay applied by the generated e2e specs.
 *
 * The benchmark wants the full e2e suite to take roughly an hour on a single
 * Playwright worker. The tests themselves finish in ~15 minutes, so every
 * generated test sleeps for E2E_TEST_DELAY_MS (default 2000ms) before it runs.
 * Set E2E_TEST_DELAY_MS=0 to disable the pacing locally.
 */
export const DEFAULT_E2E_TEST_DELAY_MS = 2000;

export function e2eTestDelayMs(): number {
  const raw = process.env['E2E_TEST_DELAY_MS'];
  if (raw === undefined || raw === '') {
    return DEFAULT_E2E_TEST_DELAY_MS;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : DEFAULT_E2E_TEST_DELAY_MS;
}

export async function pace(): Promise<void> {
  const ms = e2eTestDelayMs();
  if (ms > 0) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
