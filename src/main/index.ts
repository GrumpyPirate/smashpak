/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import path from 'path';
import url from 'url';

import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import glob from 'glob';
import imageSize from 'image-size';

import { clean, optimise, zip } from './tasks';

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  // Create a new view
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Serve up the parcel-built html file
  mainWindow.loadURL(
    isDev
      ? // Except in dev mode, where we simply point to the local dev server
        'http://localhost:3000'
      : url.format({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file:',
          slashes: true,
        }),
  );

  mainWindow.on('close', () => {
    mainWindow = null;
  });
};

app.on('ready', async () => {
  createWindow();

  if (process.env.NODE_ENV === 'development') {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REACT_PERF,
    } = require('electron-devtools-installer');

    try {
      await installExtension(REACT_DEVELOPER_TOOLS);
      await installExtension(REACT_PERF);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('extension error:', error);
    }
  }
});

app.allowRendererProcessReuse = true;

// Handle 'select source directory' messages from the renderer
ipcMain.on('select-source-directory', async (event) => {
  if (mainWindow) {
    const {
      canceled,
      filePaths: [selectedDirectory],
    } = await dialog.showOpenDialog(mainWindow, {
      title: 'Source folder',
      properties: ['openDirectory'],
    });

    if (canceled) {
      event.reply('select-source-directory', ['', undefined]);
    } else {
      let detectedInitialResolution;

      // Detect the resolution of the source designs, by reading the width of the first block or item texture
      const [firstMatchedTexturePath] = glob.sync(
        `${selectedDirectory}/**/textures/{blocks,items}/**/*.png`,
      );

      if (firstMatchedTexturePath) {
        detectedInitialResolution = imageSize(firstMatchedTexturePath).width;
      }

      event.reply('select-source-directory', [selectedDirectory, detectedInitialResolution]);
    }
  }
});

// Handle 'select output directory' messages from the renderer
ipcMain.on('select-output-directory', async (event) => {
  if (mainWindow) {
    const {
      canceled,
      filePaths: [selectedDirectory],
    } = await dialog.showOpenDialog(mainWindow, {
      title: 'Output folder',
      properties: ['openDirectory'],
    });

    event.reply('select-output-directory', canceled ? '' : selectedDirectory);
  }
});

// Handle 'generate size packs' messages from the renderer
ipcMain.on(
  'generate-size-packs',
  async (
    event,
    {
      sourceDir,
      outDir,
      resizeCount,
      initialSize,
      resourcePackName,
    }: {
      sourceDir: string;
      outDir: string;
      resizeCount: number;
      initialSize: number;
      resourcePackName: string;
    },
  ) => {
    await clean(outDir);

    await optimise({
      initialSize,
      outDir,
      resizeCount,
      sourceDir,
    });

    await zip({
      sourceDir: outDir,
      initialSize,
      resizeCount,
      resourcePackName,
    });

    // Clean up version dirs once zips are created
    const mcVersionDirs = fs
      .readdirSync(outDir)
      .map((dir) => path.join(outDir, dir))
      .filter((filepath) => fs.statSync(filepath).isDirectory());
    await Promise.all(
      mcVersionDirs.map(
        (versionDir) =>
          new Promise<void>((resolve) =>
            clean(versionDir).then(() => {
              resolve(undefined);
            }),
          ),
      ),
    );

    event.reply('generate-size-packs', { completed: true });
  },
);
