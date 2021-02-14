import * as core from '@actions/core';
import * as exec from '@actions/exec';

export const getTargetBranch = () => {
  return core.getInput('target-branch');
};

export const getCurrentBranch = async () => {
  let branch = '';

  await exec.exec(`git branch --show-current`, [], {
    listeners: {
      stdout: (data: Buffer) => {
        branch += data.toString();
      },
    },
  });

  return branch;
};
