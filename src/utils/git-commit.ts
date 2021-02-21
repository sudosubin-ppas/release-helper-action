import * as core from '@actions/core';
import { TargetBranchOptions, VersionOptions } from '../types';
import { copyToRepo } from './file';
import { git } from './git';

const checkoutReleaseBranch = async ({ targetBranch }: TargetBranchOptions) => {
  try {
    await git(`fetch origin ${targetBranch}`);
  } catch (error) {
    core.debug(`${targetBranch} branch doesn't exists in remote repository`);
  }

  try {
    await git(`checkout ${targetBranch}`);
  } catch (error) {
    await git(`checkout --orphan ${targetBranch}`);
  }
};

const addReleaseFiles = async (files: string[]) => {
  await git(`reset`);
  await git(`add -f`, files);
};

export const createCommit = async ({
  version,
  targetBranch,
}: VersionOptions & TargetBranchOptions) => {
  const files = ['README.md', 'action.yml', 'dist/index.js'];

  core.debug('Checkout to target branch');
  await checkoutReleaseBranch({ targetBranch });

  core.debug('Add files');
  await copyToRepo(files);
  await addReleaseFiles(files);

  core.debug('Commit');
  await git(`commit --no-verify --allow-empty`, [`-m ${version}`]);

  core.debug('Push');
  await git(`push origin ${targetBranch}`);
};
