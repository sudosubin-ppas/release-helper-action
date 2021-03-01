import * as core from '@actions/core';
import * as github from '@actions/github';
import { TargetBranchOptions, VersionOptions } from '../types';

const checkToCreateRelease = async () => {
  core.debug('Check to create a release');
  const createRelease = core.getInput('create-release');
  return createRelease.toLowerCase() === 'true';
};

export const createRelease = async ({
  version,
  targetBranch,
}: VersionOptions & TargetBranchOptions) => {
  const check = await checkToCreateRelease();
  if (!check) {
    core.debug('Release was not created due to action settings.');
    return;
  }

  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  const owner = process.env.GITHUB_REPOSITORY.split('/')[0];
  const repo = process.env.GITHUB_REPOSITORY.split('/')[1];

  const prerelease = version.startsWith('v0'); // ex: 'v0.1.0'

  octokit.repos.createRelease({
    owner,
    repo,
    tag_name: version,
    target_commitish: targetBranch,
    name: version,
    prerelease,
  });
};
