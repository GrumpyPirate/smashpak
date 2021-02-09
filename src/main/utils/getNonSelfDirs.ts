import fs from 'fs';
import path from 'path';

/**
 * Returns an array of first-level directory names in a baseDir
 *
 * @param  {string} baseDir
 * @returns {string[]}
 */
const getNonSelfDirs = (baseDir: string): string[] =>
  fs
    .readdirSync(baseDir)
    .reduce<string[]>(
      (accDirs, filename) =>
        fs.statSync(path.join(baseDir, filename)).isDirectory() && !filename.startsWith('.')
          ? [...accDirs, filename]
          : accDirs,
      [],
    );

export default getNonSelfDirs;
