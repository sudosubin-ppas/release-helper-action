import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const command = async (commandLine: string, args?: string[]) => {
  let output = '';

  await exec.exec(commandLine, args, {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
    },
  });

  return output;
};

export const createTempDir = async () => {
  const temp = process.env['RUNNER_TEMP'] || '';
  const tempDir = path.join(temp, uuidv4());
  await io.mkdirP(tempDir);
  return tempDir;
};

export const backupFiles = async () => {
  const tempDir = await createTempDir();
  await io.cp('.', tempDir, { recursive: true, force: false });
  await io.rmRF(path.join(tempDir, '.git'));
  return tempDir;
};

export const restoreFiles = async (backupDir: string) => {
  const files = ['action.yml', 'dist/index.js', 'README.md'];

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(backupDir, file);
      await exec.exec(`cp -r ${filePath} ./${file}`);
      // await io.cp(filePath, file, { recursive: false, force: true });
    })
  );

  core.debug(files.toString());
  return files;
};
