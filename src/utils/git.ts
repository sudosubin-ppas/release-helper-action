import * as core from '@actions/core';
import * as exec from '@actions/exec';

export const getTargetBranch = () => {
  return core.getInput('target-branch');
};

export const getCurrentBranch = () => {
  const ref = process.env.GITHUB_REF || '';
  return ref.replace('refs/heads/', '');
};

export const setupGit = async () => {
  const name = 'github-actions[bot]';
  const email = '<41898282+github-actions[bot]@users.noreply.github.com>';
  const repo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;

  await exec.exec(`git config`, ['user.name', name]);
  await exec.exec(`git config`, ['user.email', email]);
  await exec.exec(`git remote set-url origin ${repo}`);
};
