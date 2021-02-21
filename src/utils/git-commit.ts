import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { setupGit } from './git';

const checkoutReleaseBranch = async ({
  repoDir,
  targetBranch,
}: {
  repoDir: string;
  targetBranch: string;
}) => {
  try {
    await exec.exec(`git -C ${repoDir} fetch origin ${targetBranch}`);
  } catch (error) {
    core.debug(`${targetBranch} branch doesn't exists in remote repository`);
  }

  try {
    await exec.exec(`git -C ${repoDir} checkout ${targetBranch}`);
  } catch (error) {
    await exec.exec(`git -C ${repoDir} checkout --orphan ${targetBranch}`);
  }
};

const addReleaseFiles = async ({
  repoDir,
  files,
}: {
  repoDir: string;
  files: string[];
}) => {
  await exec.exec(`git -C ${repoDir} reset`);
  await exec.exec(`git -C ${repoDir} add -f`, files);
};

export const createCommit = async ({
  version,
  targetBranch,
}: {
  version: string;
  targetBranch: string;
}) => {
  const repoDir = await setupGit();

  core.debug('Checkout to target branch');
  await checkoutReleaseBranch({ repoDir, targetBranch });

  core.debug('Add files');
  const files = ['README.md', 'action.yml', 'dist/index.js'];
  await addReleaseFiles({ repoDir, files });

  core.debug('Commit');
  await exec.exec(`git -C ${repoDir} commit --no-verify --allow-empty`, [
    `-m ${version}`,
  ]);

  core.debug('Push');
  await exec.exec(`git -C ${repoDir} push origin ${targetBranch}`);
};
