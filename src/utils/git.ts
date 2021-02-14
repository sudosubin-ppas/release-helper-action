import * as core from '@actions/core';
import * as exec from '@actions/exec';

export const checkToCreateRelease = async () => {
  core.debug('Check to create a release');
  const createRelease = core.getInput('create-release');
  return createRelease.toLocaleLowerCase() === 'true';
};

export const createRelease = async () => {
  if (!checkToCreateRelease) {
    return;
  }

  exec.exec('git status');
};
