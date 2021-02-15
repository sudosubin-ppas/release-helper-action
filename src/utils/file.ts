import * as exec from '@actions/exec';
import fs from 'fs';

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

export const backupFiles = () => {
  const files = ['action.yml', 'dist/index.js', 'README.md'];
  const outputs: Record<string, string> = {};

  files.map((file) => {
    outputs[file] = fs.readFileSync(file).toString();
  });

  return outputs;
};

export const restoreFiles = (files: Record<string, string>) => {
  Object.keys(files).map((file) => {
    fs.writeFileSync(file, files[file]);
  });
};
