/**
 * Vitest setup file that pads every unit test file for the benchmark.
 *
 * Vitest evaluates setup files once before each test file, so this sleeps for
 * UNIT_TEST_FILE_DELAY_MS (default 22000ms) per file. Set
 * UNIT_TEST_FILE_DELAY_MS=0 to run unit tests at full speed locally.
 */
const DEFAULT_DELAY_MS = 22_000;

const raw = process.env['UNIT_TEST_FILE_DELAY_MS'];
const parsed = raw === undefined || raw === '' ? NaN : Number(raw);
const delayMs =
  Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_DELAY_MS;

if (delayMs > 0) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}
