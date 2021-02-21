import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { CommitOptions, TargetBranchOptions } from '../types';
import { backupFiles, restoreFiles } from './file';
import { getCurrentBranch } from './git';

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

const addReleaseFiles = async (files: string[]) => {
  await exec.exec(`git reset`);
  await exec.exec(`git add -f`, files);
};

export const createCommit = async ({
  version,
  targetBranch,
}: CommitOptions) => {
  const currentBranch = await getCurrentBranch();

  core.debug('Backup files');
  const backupDir = await backupFiles();

  core.debug('Checkout to target branch');
  await checkoutReleaseBranch({ targetBranch });

  core.debug('Restoring files');
  const files = await restoreFiles(backupDir);

  core.debug('Add files');
  await addReleaseFiles(files);

  core.debug('Commit');
  await exec.exec(`git commit --no-verify --allow-empty`, [`-m ${version}`]);

  core.debug('Push');
  await exec.exec(`git push origin ${targetBranch}`);

  core.debug('Checkout to previous branch');
  await exec.exec(`git checkout -f ${currentBranch}`);
};
