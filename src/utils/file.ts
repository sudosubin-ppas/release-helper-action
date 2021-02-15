import * as exec from '@actions/exec';

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

export const backupFiles = async () => {
  const files = ['action.yml', 'dist/index.js', 'README.md'];
  const outputs: Record<string, string> = {};

  await Promise.all(
    files.map(async (file) => {
      outputs[file] = await command(`cat ${file}`);
    })
  );

  return outputs;
};

export const restoreFiles = async (files: Record<string, string>) => {
  await Promise.all(
    Object.keys(files).map(async (file) => {
      const content = files[file];
      await exec.exec(`echo`, [`"""${content}""" > ${file}`]);
    })
  );
};
