import cp from 'child_process';
import path from 'node:path';
import process from 'node:process';
import { wd } from './dirname.mjs';

/**
 * Handles rollup build
 *
 * Hooks to build events to create `cli_output/build-lock.json`
 * @see https://rollupjs.org/guide/en/#--watchonstart-cmd---watchonbundlestart-cmd---watchonbundleend-cmd---watchonend-cmd---watchonerror-cmd
 * @param {*} options
 */
export function build({
  watch,
  fast,
  input,
  output,
  report = true,
  emit = true,
} = {}) {
  const cmd = [
    'rollup',
    '-c',
    watch ? '--watch' : '',
    '--no-watch.clearScreen',
    ...(report
      ? [('onStart', 'onError', 'onEnd')].map(
          (type) =>
            `--watch.${type} "node ./scripts/buildReporter.mjs ${type
              .toLowerCase()
              .slice(2)}"`
        )
      : []),
  ].join(' ');
  const processOptions = {
    stdio: 'inherit',
    shell: true,
    cwd: wd,
    env: {
      ...process.env,
      MINIFY: Number(!fast),
      BUILD_INPUT: Array.isArray(input) ? input.join(',') : input,
      BUILD_OUTPUT: output,
      BUILD_MIN_OUTPUT:
        output && !Array.isArray(input) && !fast
          ? path.resolve(
              path.dirname(output),
              `${path.basename(output, '.js')}.min.js`
            )
          : undefined,
      NO_EMIT: Number(!emit),
    },
  };
  if (watch) {
    cp.spawn(cmd, processOptions);
  } else {
    try {
      cp.execSync(cmd, processOptions);
    } catch (error) {
      // minimal logging, no need for stack trace
      console.error(error.message);
      // inform ci
      process.exit(1);
    }
  }
}