// Import dependencies
import { useRef, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
//import * as cpu from "@tensorflow/tfjs-backend-cpu";
//import * as webgl from "@tensorflow/tfjs-backend-webgl";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "../components/utilities";
import { GlobalContext } from "../context";
import { IoSearch } from "react-icons/io5";
import { IoCameraReverseSharp } from "react-icons/io5";

export default function MainPage() {
  const navigate=useNavigate();
  const { videoConstraints, changeVideoConstraints }=useContext(GlobalContext);
  const [isLoading, setIsLoading]=useState(true)
  const [object,setObject]=useState<any>([]);
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
      //ctx.lineWidth = 3
      drawRect(obj, ctx); 
      setObject(obj)
    }
  };

  function capture(){
    try{
        const imageSrc:any = webcamRef.current.getScreenshot();
        if(object.length>0){
            localStorage.setItem("capture",imageSrc)
            localStorage.setItem("query",object[object.length-1]['class'])
            navigate("/search")
        }
    }catch(error:any){
        console.log(error.message)
    }
  }
 
  useEffect(()=>{
    runCoco()
  },[]);

  return (
        <>
            {isLoading&&isLoading?(
                <div style={{display:"flex",justifyContent:"center", background:"#14161a", alignItems:"center", height:"100vh"}}>
                    <p style={{fontSize:14, color:"white", textAlign:"center"}}>Loading, please wait...</p>
                </div>
            ):(
                <div className="text-center h-screen">
                    <header className="h-screen flex flex-col items-center justify-center text-white bg-[#14161a]">
                        <div className="fixed h-[0px] z-10 top-0 left-0 right-0">
                            <div className="flex bg-none text-white items-center justify-between m-[20px]">
                                {/*<Link to="/">
                                    <FaChevronLeft className="w-[22px] h-[20px]"/>
                                </Link>
                                <p>Search</p>*/}
                                <button onClick={changeVideoConstraints} className="ml-auto">
                                    <IoCameraReverseSharp className="w-[30px] h-[30px]"/>
                                </button>
                            </div>
                        </div>

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
                                zIndex: 9,
                                width:"100vw"
                            }}
                            screenshotFormat="image/png"
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
                                zIndex: 10,
                                width:"100vw"
                            }}
                            width={videoConstraints.width}
                        />
                        <div className="fixed bottom-0 left-0 right-0 z-20 h-[180px]">
                            <div className="h-fit w-full flex gap-5 flex-col items-center justify-center">
                                <div className="rounded-md bg-black p-2">
                                    <p className="text-[15px]">Tap shutter button to search</p>
                                </div>
                                <button onClick={capture} className="bg-white rounded-[100px] hover:bg-blue-500 w-[50px] h-[50px] flex items-center justify-center">
                                    <IoSearch className="w-[22px] hover:text-white text-black h-[22px]"/>
                                </button>
                            </div>
                        </div>
                    </header>
                </div>
            )}
        </>
    );
}
