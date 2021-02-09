import mergeStream from 'merge-stream';

import { ResourcePackSize } from '../../renderer/context-providers/OptionsContext';
import createResizeStream from '../utils/createResizeStream';
import getNonSelfDirs from '../utils/getNonSelfDirs';

const optimise = ({
  sourceDir,
  outDir,
  resizeCount,
  initialSize,
}: {
  sourceDir: string;
  outDir: string;
  resizeCount: number;
  initialSize: number;
}): Promise<void> => {
  const targetTextureSizes = Array.from({ length: resizeCount }).map(
    (_, i) => initialSize / 2 ** i,
  ) as ResourcePackSize[];
  const nonSelfDirs = getNonSelfDirs(sourceDir);

  const streams = nonSelfDirs.map((mcVersion) =>
    targetTextureSizes.map((size) =>
      createResizeStream({
        outDir,
        sourceDir,
        mcVersion,
        size,
        initialSize,
      }),
    ),
  );

  return new Promise((resolve) => {
    mergeStream(...streams)
      .on('data', () => undefined)
      .on('end', () => {
        resolve();
      });
  });
};

export default optimise;
