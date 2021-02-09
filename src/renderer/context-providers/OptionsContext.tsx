import React, { createContext, FunctionComponent, useCallback, useState } from 'react';

export type ResourcePackSize = 512 | 256 | 128 | 64 | 32;

export type Options = {
  packName: string;
  initialSize?: ResourcePackSize | 'none';
  resizeCount?: number;
  sourceDir?: string;
  outDir?: string;
};

const defaultOptions: Options = {
  packName: 'My Resource Pack',
};

export const OptionsContext = createContext<
  [options: Options, setOptions: (options: Partial<Options>) => void]
>([defaultOptions, () => undefined]);

const OptionsContextProvider: FunctionComponent = ({ children }) => {
  const [optionsState, setOptionsState] = useState(defaultOptions);
  const setOptions = useCallback<(options: Partial<Options>) => void>((options) => {
    setOptionsState((currentOptions) => ({
      ...currentOptions,
      ...options,
    }));
  }, []);

  return (
    <OptionsContext.Provider value={[optionsState, setOptions]}>{children}</OptionsContext.Provider>
  );
};

export default OptionsContextProvider;
