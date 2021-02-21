import * as core from '@actions/core';
import { TargetBranchOptions, VersionOptions } from '../types';
import { copyToRepo } from './file';
import { git, setupGit } from './git';

const checkoutReleaseBranch = async ({
  targetBranch,
}: {
  targetBranch: string;
}) => {
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

const addReleaseFiles = async ({ files }: { files: string[] }) => {
  await git(`reset`);
  await git(`add -f`, files);
};

export const createCommit = async ({
  version,
  targetBranch,
}: VersionOptions & TargetBranchOptions) => {
  await setupGit();
  const files = ['README.md', 'action.yml', 'dist/index.js'];

  core.debug('Checkout to target branch');
  await checkoutReleaseBranch({ targetBranch });

  core.debug('Copy files');
  await copyToRepo(files);

  core.debug('Add files');
  await addReleaseFiles({ files });

  core.debug('Commit');
  await git(`commit --no-verify --allow-empty`, [`-m ${version}`]);

  core.debug('Push');
  await git(`push origin ${targetBranch}`);
};
