import * as core from '@actions/core';
import * as exec from '@actions/exec';

export const setupYarn = async () => {
  core.debug('Installing yarn');
  await exec.exec('npm install --global yarn');
};
