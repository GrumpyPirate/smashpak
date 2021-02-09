import path from 'path';

import gulp from 'gulp';
import gulpZip from 'gulp-zip';

import { ResourcePackSize } from '../../renderer/context-providers/OptionsContext';

const createZipStream = ({
  mcVersion,
  sourceDir,
  resolution,
  resourcePackName,
}: {
  mcVersion: string;
  sourceDir: string;
  resolution: ResourcePackSize;
  resourcePackName: string;
}): NodeJS.ReadWriteStream => {
  // Intended zip name:
  // e.g.: MyTexturePack_MC1.16.4_64x.zip
  const sanitisedResourcePackName = resourcePackName.replace(/ /gi, '');
  const zipName = `${sanitisedResourcePackName}_MC${mcVersion}_${resolution}x.zip`;
  const baseDir = path.join(sourceDir, mcVersion, `${resolution}x`);

  return (
    gulp
      .src(`${baseDir}/**`, { base: baseDir })
      // zip everything up
      .pipe(gulpZip(zipName))
      // Throw the zips out into the same directory
      .pipe(gulp.dest(sourceDir))
  );
};

export default createZipStream;
