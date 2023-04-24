import { useCallback, useEffect } from "react";
import './App.css'
import { Unity, useUnityContext } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

function useUnity(): UnityProvider {
  const { unityProvider, sendMessage, addEventListener } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  const TheEventName = 'theReactUnityEvent';
  const handleEvent = useCallback(
    (...args: any[]) => {
      (async (args: any[]) => {   
      console.log('[unity-web communication] triggered onAnimocaStake cb from Unity - payload from unity:', ...args);

      await new Promise((resolve) => setTimeout(resolve, 500));

      sendMessage('RaceStakingContractBridge' , TheEventName, {
        payloadEvent: 'completed',
      });

      })(args);
    },
    []
  );

  const UnityToReactEventName = 'onTheUnityToReactEvent'
  useEffect(
    function () {
      addEventListener(UnityToReactEventName, handleEvent);

      return function cleanup() {
        addEventListener(UnityToReactEventName, handleEvent);
      };
    },
    [handleEvent]
  );

  const handleUnityReady = useCallback(
    () => console.log('(success) received UnityReady event'), []);
  const UnityReadyEventName = 'UnityReady'
  useEffect(
    function () {
      addEventListener(UnityReadyEventName, handleUnityReady);

      return function cleanup() {
        addEventListener(UnityReadyEventName, handleUnityReady);
      };
    },
    [handleUnityReady]
  );


  return unityProvider
}

function App() {
  const unityProvider = useUnity();

  return <div className="fullscreen" ><Unity className="w-full h-full" unityProvider={unityProvider} /></div>;
}

export default App
