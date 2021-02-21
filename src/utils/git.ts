import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import { createTempDir } from './file';

export const getTargetBranch = () => {
  return core.getInput('target-branch');
};

export const git = async (commandLine: string, args?: string[]) => {
  if (!process.env.REPO_DIR) {
    throw new Error('Git repoDir was not set!');
  }
  await exec.exec(`git -C ${process.env.REPO_DIR} ${commandLine}`, args);
};

export const setupGit = async () => {
  const repoDir = await createTempDir();
  await io.cp('.', repoDir, { recursive: true, force: false });

  const name = 'github-actions[bot]';
  const email = '41898282+github-actions[bot]@users.noreply.github.com';
  const repo = `https://${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;

  await exec.exec(`git -C ${repoDir} config user.name ${name}`);
  await exec.exec(`git -C ${repoDir} config user.email ${email}`);
  await exec.exec(`git -C ${repoDir} remote set-url origin ${repo}`);

  process.env.REPO_DIR = repoDir;
};
