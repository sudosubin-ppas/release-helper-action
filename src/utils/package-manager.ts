import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import path from 'path';
import { createTempDir } from './file';

const extractTarWithStrip = async (file: string) => {
  const outputPath = await createTempDir();
  await exec.exec(`tar xfz ${file} -C ${outputPath} --strip-components=1`);
  return outputPath;
};

export const setupYarn = async () => {
  core.debug('Installing yarn');

  core.debug('Download and extracting yarn');
  const downloadUrl = `https://yarnpkg.com/latest.tar.gz`;
  const yarnPath = await tc.downloadTool(downloadUrl);
  const toolPath = await extractTarWithStrip(yarnPath);

  core.debug('Add to system path');
  const cachedPath = await tc.cacheDir(toolPath, 'yarn', 'latest');
  core.addPath(path.join(cachedPath, 'bin'));
};
