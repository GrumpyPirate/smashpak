import mergeStream from 'merge-stream';

import { ResourcePackSize } from '../../renderer/context-providers/OptionsContext';
import createZipStream from '../utils/createZipStream';
import getNonSelfDirs from '../utils/getNonSelfDirs';

const zip = ({
  sourceDir,
  resizeCount,
  initialSize,
  resourcePackName,
}: {
  sourceDir: string;
  resizeCount: number;
  initialSize: number;
  resourcePackName: string;
}): Promise<void> => {
  const targetTextureSizes = Array.from({ length: resizeCount }).map<ResourcePackSize>(
    (_, i) => (initialSize / 2 ** i) as ResourcePackSize,
  );

  // Assume that all dirs inside the sourceDir are MC versions
  const streams = getNonSelfDirs(sourceDir).map((dir) =>
    targetTextureSizes.map((size) =>
      createZipStream({
        mcVersion: dir,
        sourceDir,
        resolution: size,
        resourcePackName,
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

export default zip;
