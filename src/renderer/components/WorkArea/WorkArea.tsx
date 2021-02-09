import { desaturate, lighten, mix, position, rem, size, transparentize } from 'polished';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DragObjectWithType, useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { FolderPlus } from 'react-feather';
import styled from 'styled-components';

import { appBg, gutter } from '../../config/styles';
import { OptionsContext, ResourcePackSize } from '../../context-providers/OptionsContext';
import useIPCMessageTopic from '../../hooks/useIPCMessageTopic';
import Button from '../Forms/Button/Button';
import { Field, FieldAddon, FieldGroup, FieldLabel, FieldLabelText } from '../Forms/Field';
import Input from '../Forms/Input/Input';
import Spinner from '../Spinner/Spinner';

type DroppableFile = DragObjectWithType & { files: File[] };

const isDirectory = async (file: File): Promise<boolean> => {
  try {
    await file.arrayBuffer();

    return false;
  } catch (error) {
    return true;
  }
};

const isValidResolution = (resolution?: number): boolean => {
  switch (resolution) {
    case 512:
    case 256:
    case 128:
    case 64:
    case 32:
      return true;
    default:
      return false;
  }
};

const Submit = styled.div`
  margin-top: ${rem(32)};
`;

const DropOverlay = styled.div`
  ${size('100%')};
  ${position('absolute')}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background-color: ${transparentize(0.25, mix(0.5)(appBg)('#888'))};
  z-index: 1;

  &::after {
    ${position('absolute')}
    content: '';
    width: calc(100% - ${rem(32)});
    height: calc(100% - ${rem(32)});
    top: ${rem(16)};
    left: ${rem(16)};
    border-radius: ${rem(16)};
    border: ${rem(4)} dashed;
    background-color: ${transparentize(0.25, appBg)};
    z-index: -1;
  }

  svg {
    display: block;
    width: ${rem(32)};
    height: ${rem(32)};
    margin-top: ${rem(12)};
  }
`;

const Content = styled.div`
  ${position('absolute')}
  ${size('100%')}
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: ${rem(24)} ${rem(gutter)};
`;

const Wrapper = styled.div<{ isHovering: boolean }>`
  position: relative;
  background-color: ${lighten(0.025)(desaturate(0.1)(appBg))};
  text-align: center;

  ${Field} {
    width: 75%;
  }
`;

const WorkArea: FunctionComponent = () => {
  const [isGeneratingPack, setIsGeneratingPack] = useState(false);
  const [
    { initialSize, sourceDir = '', resizeCount, outDir = '', packName },
    setOptions,
  ] = useContext(OptionsContext);
  const [{ isHovering }, drop] = useDrop({
    accept: NativeTypes.FILE,
    drop: async ({ files }: DroppableFile) => {
      if (files.length > 0 && (await isDirectory(files[0]))) {
        setOptions({
          sourceDir: files[0].path,
        });
      }
    },
    collect: (monitor) => ({
      isHovering: monitor.isOver(),
    }),
  });

  const publishGenerateSizePacks = useIPCMessageTopic<
    {
      sourceDir: string;
      outDir: string;
      resizeCount: number;
      initialSize: number;
    },
    { completed: boolean }
  >('generate-size-packs', ({ completed }) => {
    if (completed) {
      setIsGeneratingPack(false);
    }
  });

  const publishSelectSourceDir = useIPCMessageTopic<
    void,
    [selectedDirectory: string, detectedInitialResolution?: number]
  >('select-source-directory', ([selectedDirectory, detectedInitialResolution]) => {
    if (selectedDirectory) {
      setOptions({ sourceDir: selectedDirectory });
    }

    setOptions({
      initialSize: isValidResolution(detectedInitialResolution)
        ? (detectedInitialResolution as ResourcePackSize)
        : 'none',
    });
  });

  const publishSelectOutputDir = useIPCMessageTopic<void, string>(
    'select-output-directory',
    (selectedDirectory) => {
      if (selectedDirectory) {
        setOptions({ outDir: selectedDirectory });
      }
    },
  );

  const handleGeneratePacksClick = useCallback(
    (sizePackOptions: {
      sourceDir: string;
      outDir: string;
      resizeCount: number;
      initialSize: number;
      resourcePackName: string;
    }) => {
      setIsGeneratingPack(true);
      publishGenerateSizePacks(sizePackOptions);
    },
    [publishGenerateSizePacks],
  );

  const prettyInDir = useMemo(() => {
    const segments = sourceDir.split('/');

    return segments.length < 2
      ? sourceDir
      : ['…', ...segments.slice(-2, segments.length)].join('/');
  }, [sourceDir]);

  const prettyOutDir = useMemo(() => {
    const segments = outDir.split('/');

    return segments.length < 2 ? outDir : ['…', ...segments.slice(-2, segments.length)].join('/');
  }, [outDir]);

  const canGenerate =
    typeof resizeCount === 'number' &&
    resizeCount <= 5 &&
    resizeCount > 0 &&
    initialSize &&
    sourceDir &&
    outDir &&
    !isGeneratingPack;

  /**
   * Use a side-effect to:
   *  - Update the outDir, when the sourceDir changes
   */
  useEffect(() => {
    if (sourceDir) {
      const sourceDirSegments = sourceDir.split('/');

      setOptions({
        outDir: [...sourceDirSegments.slice(0, sourceDirSegments.length - 1), 'size-packs'].join(
          '/',
        ),
      });
    }
  }, [setOptions, sourceDir]);

  return (
    <Wrapper ref={drop} isHovering={isHovering}>
      {isHovering && (
        <DropOverlay>
          Select this directory
          <FolderPlus />
        </DropOverlay>
      )}
      <Content>
        {/* Source dir */}
        <Field>
          <FieldLabel htmlFor="input__source-dir">
            <FieldLabelText>Source directory</FieldLabelText>
          </FieldLabel>
          <FieldGroup>
            <Input
              type="text"
              id="input__source-dir"
              readOnly
              value={prettyInDir}
              title={sourceDir}
            />
            <FieldAddon>
              <Button
                type="button"
                onClick={() => {
                  publishSelectSourceDir();
                }}
                disabled={isGeneratingPack}
              >
                Select
              </Button>
            </FieldAddon>
          </FieldGroup>
        </Field>

        {/* Out dir */}
        <Field>
          <FieldLabel htmlFor="input__out-dir">
            <FieldLabelText>Output directory</FieldLabelText>
          </FieldLabel>
          <FieldGroup>
            <Input type="text" id="input__out-dir" readOnly value={prettyOutDir} title={outDir} />
            <FieldAddon>
              <Button
                type="button"
                onClick={() => {
                  publishSelectOutputDir();
                }}
                disabled={isGeneratingPack}
              >
                Select
              </Button>
            </FieldAddon>
          </FieldGroup>
        </Field>

        <Submit>
          <Button
            type="button"
            onClick={() => {
              if (typeof initialSize === 'number' && outDir && resizeCount && sourceDir) {
                handleGeneratePacksClick({
                  initialSize,
                  outDir,
                  resizeCount,
                  sourceDir,
                  resourcePackName: packName,
                });
              }
            }}
            disabled={!canGenerate}
          >
            {isGeneratingPack ? (
              <>
                Generating...
                <Spinner />
              </>
            ) : (
              'Generate'
            )}
          </Button>
        </Submit>
      </Content>
    </Wrapper>
  );
};

export default WorkArea;
