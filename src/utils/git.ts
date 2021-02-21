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
  process.env.REPO_DIR = await createTempDir();
  await io.cp('.', process.env.REPO_DIR, { recursive: true, force: false });

  const name = 'github-actions[bot]';
  const email = '41898282+github-actions[bot]@users.noreply.github.com';
  const repo = `https://${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;

  await git(`config user.name ${name}`);
  await git(`config user.email ${email}`);
  await git(`remote set-url origin ${repo}`);
};
