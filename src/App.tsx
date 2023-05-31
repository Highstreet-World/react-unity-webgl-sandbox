import { useEffect } from "react";
import './App.css'
import { Unity, useUnityContext } from "react-unity-webgl";
import { UnityProvider } from "react-unity-webgl/distribution/types/unity-provider";

function useUnity(): UnityProvider {
  const { unityProvider, UNSAFE__unityInstance } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  const unityInstace = UNSAFE__unityInstance;

  const dispatchActionToWeb = function (action: string, payload: string, callback: (unityInstance: any, payload: string) => any) {
    console.log(`[web] received action from unity. action=${action}. payload=${payload}`)
    switch (action) {
      case "test":
        var obj = JSON.parse(payload);
        var num = obj.num;
        num++;
        
        obj.num=num;
        
        var message = JSON.stringify(obj);
        console.log("[web] message: " + message);
        callback(unityInstace, message);
        break;

      default:
        console.log(`[web] unknown action from unity. action=${action}`)
        break;
    }
  };

  useEffect(() => {
    window.unityContext = {
      unityInstace: unityInstace,
      dispatchActionToWeb: dispatchActionToWeb
    }

    return () => {
      window.unityContext = undefined
    }
  }, [dispatchActionToWeb, unityInstace]);

  return unityProvider
}

function App() {
  const unityProvider = useUnity();

  return <div className="fullscreen" ><Unity className="w-full h-full" unityProvider={unityProvider} /></div>;
}

export default App
