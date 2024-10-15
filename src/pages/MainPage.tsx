// Import dependencies
import { useRef, useEffect, useState, useContext } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
//import * as cpu from "@tensorflow/tfjs-backend-cpu";
//import * as webgl from "@tensorflow/tfjs-backend-webgl";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "../components/utilities";
import { GlobalContext } from "../context";

export default function MainPage() {
  const { videoConstraints }=useContext(GlobalContext);
  const [isLoading, setIsLoading]=useState(true)
  const webcamRef:any = useRef(null);
  const canvasRef:any = useRef(null);

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

  const detect = async (net:any) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video:any = webcamRef.current.video;
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
                    <p style={{fontSize:14, color:"white", textAlign:"center"}}>Loading, please wait...</p>
                </div>
            ):(
                <div className="App">
                    <header className="App-header">
                        <Webcam
                            ref={webcamRef}
                            audio={false} 
                            style={{
                                position: "absolute",
                                marginLeft: "auto",
                                marginRight: "auto",
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                zIndex: 9
                            }}
                            height={videoConstraints.height}
                            width={videoConstraints.width}
                            videoConstraints={videoConstraints}
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
                                zIndex: 10
                            }}
                            height={videoConstraints.height}
                            width={videoConstraints.width}
                        />
                    </header>
                </div>
            )}
        </>
    );
}
