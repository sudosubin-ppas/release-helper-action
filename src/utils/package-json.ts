import * as core from '@actions/core';
import { command } from './file';

export const getPackageVersion = async () => {
  const output = await command(`npm -s run env echo`, ['$npm_package_version']);
  const version = output.trim();
  core.info(`Version found: v${version}`);

  return version;
};
