import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { command } from './file';

export const getTargetBranch = () => {
  return core.getInput('target-branch');
};

export const getCurrentBranch = async () => {
  const output = await command(`git rev-parse --abbrev-ref HEAD`);
  return output.trim();
};

export const setupGit = async () => {
  const name = 'github-actions[bot]';
  const email = '41898282+github-actions[bot]@users.noreply.github.com';
  const repo = `https://${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;

  await exec.exec(`git config`, ['user.name', name]);
  await exec.exec(`git config`, ['user.email', email]);
  await exec.exec(`git remote set-url origin ${repo}`);
};

export const cleanGit = async () => {
  await exec.exec(`git config --unset user.name`);
  await exec.exec(`git config --unset user.email`);
};
