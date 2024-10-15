// Import dependencies
import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
//import * as cpu from "@tensorflow/tfjs-backend-cpu";
//import * as webgl from "@tensorflow/tfjs-backend-webgl";
import * as cocossd from "@tensorflow-models/coco-ssd";
import "./App.css";
import { drawRect } from "./utilities";

function App() {
  const [isLoading, setIsLoading]=useState(true)
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  tf.setBackend("webgl");
  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("cocossd model loaded.");
    setIsLoading(false)
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);
      // console.log(obj)
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx); 
    }
  };

  useEffect(()=>{
    runCoco()
  },[]);

  return (
      <>
          {isLoading&&isLoading?(
              <div style={{display:"flex",justifyContent:"center", background:"#252525", alignItems:"center", height:"100vh"}}>
              <p style={{text:"14px", color:"white"}}>Loading, please wait...</p>
              </div>
          ):(
                <div className="App">
                    <header className="App-header">
                        <Webcam
                            ref={webcamRef}
                            muted={true} 
                            style={{
                                position: "absolute",
                                marginLeft: "auto",
                                marginRight: "auto",
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                zindex: 9,
                                width: "100vw",
                                height: "100vh",
                            }}
                        />

                        <canvas
                            ref={canvasRef}
                            style={{
                                position: "absolute",
                                marginLeft: "auto",
                                marginRight: "auto",
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                zindex: 8,
                                width: "100vw",
                                height: "100vh",
                            }}
                        />
                    </header>
                </div>
            )}
        </>
    );
}

export default App;
