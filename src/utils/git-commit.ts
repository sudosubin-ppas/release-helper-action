import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { CommitOptions, TargetBranchOptions } from '../types';

const checkoutReleaseBranch = async ({ targetBranch }: TargetBranchOptions) => {
  try {
    await exec.exec(`git fetch origin ${targetBranch}`);
  } catch (error) {
    core.debug(`${targetBranch} doesn't exists in remote repository`);
  }

  try {
    await exec.exec(`git checkout ${targetBranch}`);
  } catch (error) {
    await exec.exec(`git checkout --orphan ${targetBranch}`);
  }
};

const addReleaseFiles = async () => {
  const files = ['action.yml', 'dist/index.js', 'README.md'];
  await exec.exec(`git reset`);
  await exec.exec(`git add -f`, files);
};

export const createCommit = async ({ version }: CommitOptions) => {
  const targetBranch = core.getInput('target-branch');

  core.debug('Checkout to target branch');
  await checkoutReleaseBranch({ targetBranch });

  core.debug('Add files');
  await addReleaseFiles();

  core.debug('Commit');
  await exec.exec(`git commit --no-verify --allow-empty -m`, [`v${version}`]);

  core.debug('Push');
  await exec.exec(`git push origin ${targetBranch}`);
};
