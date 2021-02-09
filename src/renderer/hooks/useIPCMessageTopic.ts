import { useCallback, useEffect } from 'react';

const { ipcRenderer } = window.require('electron');

type Result<O> = (payload: O) => void;

const useIPCMessageTopic = <
  OutgoingPayload = Record<string, unknown>,
  IncomingPayload = Record<string, unknown>
>(
  topic: string,
  onMessage: (message: IncomingPayload) => void,
): Result<OutgoingPayload> => {
  const publish = useCallback(
    (payload: OutgoingPayload) => {
      ipcRenderer.send(topic, payload);
    },
    [topic],
  );

  /**
   * Use a side-effect to:
   *  - Subscribe to the message topic
   */
  useEffect(() => {
    ipcRenderer.on(topic, (_, message: IncomingPayload) => {
      onMessage(message);
    });

    return () => {
      ipcRenderer.removeListener(topic, onMessage);
    };
  }, [onMessage, topic]);

  return publish;
};

export default useIPCMessageTopic;
