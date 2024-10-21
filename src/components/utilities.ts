
export const drawRect = (detections:any, ctx:any) =>{
    try{
            // Loop through each prediction
            detections.forEach((prediction:any) => {
                const lastElem=detections[detections.length-1]
    
                // Extract boxes and classes
                const [x, y, width, height] = prediction['bbox']; 
                const texts = prediction['class'];
                const lastTxt=lastElem['class']
                textToSpeech(lastTxt)

                // Set styling
                const color = Math.floor(Math.random()*16777215).toString(16);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#' + color
                ctx.font = '20px Arial';

                // Draw rectangles and text
                ctx.beginPath();   
                ctx.fillStyle = '#' + color
                ctx.fillText(texts, x, y);
                ctx.rect(x, y, width, height); 
                ctx.stroke();
            });
    }catch(error:any){
        console.log(error.message)
    }
}

export function textToSpeech(text:string){
    let audioState:any=localStorage.getItem("audio")
    if(audioState==="unmute"||!audioState){
        // Create a new instance of SpeechSynthesisUtterance
        var speech = new SpeechSynthesisUtterance(text);

        // Set the voice, rate, pitch, and language if desired
        speech.lang = 'en-US'; // You can change the language
        speech.rate = 1; // Speed (default is 1, range: 0.1 to 10)
        speech.pitch = 1; // Pitch (default is 1, range: 0 to 2)

        // Speak the text
        window.speechSynthesis.speak(speech);
    }else{
        window.speechSynthesis.cancel()
    }
}
