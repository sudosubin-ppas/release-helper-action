import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { ReleaseOptions } from '../types';

export const checkToCreateRelease = async () => {
  core.debug('Check to create a release');
  const createRelease = core.getInput('create-release');
  return createRelease.toLocaleLowerCase() === 'true';
};

const checkoutReleaseBranch = async () => {
  const targetBranch = exec.exec(`git checkout --orphan release-test`);
};

export const createRelease = async ({
  version,
  currentBranch,
}: ReleaseOptions) => {
  exec.exec('git status');
};
