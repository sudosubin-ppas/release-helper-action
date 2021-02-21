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
