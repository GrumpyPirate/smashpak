import fs from 'fs';

import rimraf from 'rimraf';

const clean = (outputDir: string): Promise<void> =>
  new Promise((resolve) => {
    if (fs.statSync(outputDir).isDirectory()) {
      rimraf(outputDir, () => {
        resolve();
      });
    } else {
      resolve();
    }
  });

export default clean;
