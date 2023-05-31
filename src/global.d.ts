declare global {
  interface Window {
    unityContext?: {
      unityInstance: any;
      dispatchActionToWeb: (event: string, payload: string, callback: (unityInstance: any, payload: string) => any) => void;
    };
  }
}
