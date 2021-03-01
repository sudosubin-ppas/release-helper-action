import * as core from '@actions/core';
import * as github from '@actions/github';
import type { RequestError } from '@octokit/types';
import type { TargetBranchOptions, VersionOptions } from '../types';
import { getGitInfo } from './git';

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

  const { token, owner, repo } = getGitInfo();
  const octokit = github.getOctokit(token);

  const prerelease = version.startsWith('v0'); // ex: 'v0.1.0'

  try {
    await octokit.repos.createRelease({
      owner,
      repo,
      tag_name: version,
      target_commitish: targetBranch,
      name: version,
      body: '* This release was automatically created by @github-actions',
      prerelease,
    });
  } catch (err) {
    const error = err as RequestError;
    if (typeof error.errors === 'undefined') {
      throw error;
    }

    const tagError = error.errors.find((e) => e.code === 'already_exists');
    if (!tagError) {
      throw error;
    }

    core.debug('Duplicate tag name, so release was not created');
  }
};
