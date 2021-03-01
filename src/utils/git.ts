import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import { createTempDir } from './file';

export const getTargetBranch = () => {
  return core.getInput('target-branch');
};

export const getGitInfo = () => {
  const repository = process.env.GITHUB_REPOSITORY || '';

  return {
    owner: repository.split('/')[0],
    repo: repository.split('/')[1],
  };
};

export const git = async (commandLine: string, args?: string[]) => {
  if (!process.env.REPO_DIR) {
    throw new Error('Git repoDir was not set!');
  }
  await exec.exec(`git -C ${process.env.REPO_DIR} ${commandLine}`, args);
};

export const setupGit = async () => {
  const { owner, repo } = getGitInfo();
  process.env.REPO_DIR = await createTempDir();
  await io.cp('.', process.env.REPO_DIR, { recursive: true, force: false });

  const name = 'github-actions[bot]';
  const email = '41898282+github-actions[bot]@users.noreply.github.com';
  const repository = `https://${process.env.GITHUB_TOKEN}@github.com/${owner}/${repo}.git`;

  await git(`config user.name ${name}`);
  await git(`config user.email ${email}`);
  await git(`remote set-url origin ${repository}`);
};
