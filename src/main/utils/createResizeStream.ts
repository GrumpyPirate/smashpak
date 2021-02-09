/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import { Transform } from 'stream';

import gulp from 'gulp';
import gulpFilter from 'gulp-filter';
import gulpImagemin from 'gulp-imagemin';
import gulpRename from 'gulp-rename';
import sharp from 'sharp';
import Vinyl, { BufferFile } from 'vinyl';

import { ResourcePackSize } from '../../renderer/context-providers/OptionsContext';

const gulpIgnore = require('gulp-ignore');

const defaultResizeables = ['**/*.png', '!**/{gui,guis}/**/*.png'];
const defaultThresholdables = ['**/*item*/**/*.png'];
const defaultJunkFileTypes = ['**/*.{ai,psb,psd}', '**/*.{DS_Store,db}'];

const createResizeStream = ({
  outDir,
  sourceDir,
  mcVersion,
  size,
  initialSize,
  resizeables = defaultResizeables,
  thresholdables = defaultThresholdables,
  junkFileTypes = defaultJunkFileTypes,
}: {
  outDir: string;
  sourceDir: string;
  mcVersion: string;
  size: ResourcePackSize;
  initialSize: number;
  resizeables?: string[];
  thresholdables?: string[];
  junkFileTypes?: string[];
}): NodeJS.ReadWriteStream => {
  const scale = size / initialSize; // e.g. 0.5, 0.25, 0.125, etc.
  const packSize = `${size}x`; // 256x
  const customDirname = path.join(mcVersion, packSize); // 1.7.10/256x

  // Set up PNG-only file filter
  const filterPNG = gulpFilter('**/*.png', { restore: true });
  // Resize these files
  const filterResizeables = gulpFilter(resizeables, { restore: true });
  // Apply threshold filter to (remove transparent pixels from) these files
  const filterThresholdables = gulpFilter(thresholdables, { restore: true });

  return (
    gulp
      // source everything
      .src(path.join(sourceDir, mcVersion, '**'), {
        base: path.join(sourceDir, mcVersion),
      })
      // Filter out crap
      .pipe(gulpIgnore(junkFileTypes))
      // Do the following steps to PNGs only( i.e. no .txt, .mcmeta files)
      .pipe(filterPNG)
      // Do the following to ONLY PATCH_CONFIG.resizeables
      .pipe(filterResizeables)
      // Resize images
      .pipe(
        new Transform({
          objectMode: true,
          transform: async (chunk: BufferFile, encoding, callback) => {
            try {
              const origImage = sharp(chunk.contents);
              const {
                height = initialSize,
                width = initialSize,
              } = await origImage.clone().metadata();

              callback(
                null,
                new Vinyl({
                  path: path.resolve(chunk.relative),
                  contents: await origImage
                    .resize({
                      width: width * scale,
                      height: height * scale,
                      kernel: sharp.kernel.cubic,
                    })
                    .png()
                    .toBuffer(),
                }),
              );
            } catch (error) {
              console.log('error:', error);
              callback(error, chunk);
            }
          },
        }),
      )
      .pipe(filterResizeables.restore)
      // Apply threshold to (remove partial transparency from) whitelisted images paths
      .pipe(filterThresholdables)
      .pipe(
        new Transform({
          objectMode: true,
          transform: async (chunk: BufferFile, encoding, callback) => {
            const origImage = sharp(chunk.contents);
            const { isOpaque } = await origImage.stats();

            if (isOpaque) {
              callback(undefined, chunk);
            } else {
              try {
                // Extract the alpha channel, threshold it
                const alphaChannel = await origImage
                  .clone()
                  .extractChannel('alpha')
                  .toColourspace('b-w')
                  .toBuffer();
                const alphaChannelThresholded = await sharp(alphaChannel).threshold().toBuffer();

                // Combine it with original image
                const newImageWithoutAlpha = await origImage.removeAlpha().toBuffer();
                const newImageWithAlpha = await sharp(newImageWithoutAlpha)
                  .joinChannel(alphaChannelThresholded)
                  .toBuffer();

                callback(
                  null,
                  new Vinyl({
                    path: path.resolve(chunk.relative),
                    contents: newImageWithAlpha,
                  }),
                );
              } catch (error) {
                console.log('error:', error);
                callback(error, chunk);
              }
            }
          },
        }),
      )
      .pipe(filterThresholdables.restore)
      .pipe(
        gulpImagemin([
          gulpImagemin.optipng({
            optimizationLevel: 4,
            bitDepthReduction: true,
            colorTypeReduction: false,
            paletteReduction: true,
          }),
        ]),
      )
      // Restore non-PNG files to stream
      .pipe(filterPNG.restore)
      .pipe(
        gulpRename((filePath) => ({
          ...filePath,
          dirname: path.join(customDirname, filePath.dirname),
        })),
      )
      .pipe(gulp.dest(outDir))
  );
};

export default createResizeStream;
