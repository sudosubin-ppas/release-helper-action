import * as core from '@actions/core';
import { command } from './file';

export const getPackageVersion = async () => {
  const output = await command(`npm -s run env echo`, ['$npm_package_version']);
  const version = `v${output.trim()}`;
  core.debug(`Version found: ${version}`);
  return version;
};
