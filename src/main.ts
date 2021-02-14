import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { createRelease } from './utils/git';
import { setupYarn } from './utils/package-manager';

const run = async () => {
  core.info('Setting up environment');
  await setupYarn();

  core.info('Prepare action');
  const prepareCommand = core.getInput('prepare-command');
  await exec.exec(prepareCommand);

  core.info('Build action');
  const buildCommand = core.getInput('build-command');
  await exec.exec(buildCommand);

  core.info('Create Release');
  await createRelease();
};

run();
