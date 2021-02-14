import * as core from '@actions/core';
import * as exec from '@actions/exec';

export const getPackageVersion = async () => {
  let rawVersion = '';

  await exec.exec(`npm -s run env echo`, ['$npm_package_version'], {
    listeners: {
      stdout: (data: Buffer) => {
        rawVersion += data.toString();
      },
    },
  });

  const version = rawVersion.trim();
  core.info(`Version found: v${version}`);
  return version;
};
