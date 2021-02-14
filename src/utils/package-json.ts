import * as core from '@actions/core';
import * as exec from '@actions/exec';

export const getPackageVersion = async () => {
  let version = '';

  await exec.exec(`npm -s run env echo '$npm_package_version'`, [], {
    listeners: {
      stdout: (data: Buffer) => {
        version += data.toString();
      },
    },
  });

  core.info(`Version found: v${version.trim()}`);
  return version.trim();
};
