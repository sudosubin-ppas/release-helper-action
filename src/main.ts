import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { getTargetBranch, setupGit } from './utils/git';
import { createCommit } from './utils/git-commit';
import { createRelease } from './utils/git-release';
import { getPackageVersion } from './utils/package-json';
import { setupYarn } from './utils/package-manager';

const run = async () => {
  try {
    core.info('Setting up environment');
    await setupGit();
    await setupYarn();
    const version = await getPackageVersion();
    const targetBranch = getTargetBranch();

    core.info('Prepare action');
    const prepareCommand = core.getInput('prepare-command');
    await exec.exec(prepareCommand);

    core.info('Build action');
    const buildCommand = core.getInput('build-command');
    await exec.exec(buildCommand);

    core.info('Create Commit');
    await createCommit({ version, targetBranch });

    core.info('Create Release');
    await createRelease({ version });
  } catch (error) {
    core.setFailed(`Action failed for uncaught error: ${error}`);
  }
};

run();
