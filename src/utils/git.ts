import * as core from '@actions/core';
import * as exec from '@actions/exec';

export const getTargetBranch = () => {
  return core.getInput('target-branch');
};

export const getCurrentBranch = async () => {
  let branch = '';

  await exec.exec(`git rev-parse --abbrev-ref HEAD`, [], {
    listeners: {
      stdout: (data: Buffer) => {
        branch += data.toString();
      },
    },
  });

  return branch;
};

export const getGithubBotAuthor = () => {
  return 'github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>';
};
