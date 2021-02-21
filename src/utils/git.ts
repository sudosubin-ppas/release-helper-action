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

export const getGitAuthor = () => {
  const username = 'github-actions[bot]';
  const email = '41898282+github-actions[bot]@users.noreply.github.com';
  return `${username} <${email}>`;
};

export const setupGit = async () => {
  const repo = `https://${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;
  await exec.exec(`git remote set-url origin ${repo}`);
};
