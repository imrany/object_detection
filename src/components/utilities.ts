
export const drawRect = (detections:any, ctx:any) =>{
    try{
            // Loop through each prediction
            detections.forEach((prediction:any) => {
                const lastElem=detections[detections.length-1]
    
                // Extract boxes and classes
                const [x, y, width, height] = prediction['bbox']; 
                const text = prediction['class'];

                // Create a new instance of SpeechSynthesisUtterance
                var speech = new SpeechSynthesisUtterance(lastElem['class']);

                // Set the voice, rate, pitch, and language if desired
                speech.lang = 'en-US'; // You can change the language
                speech.rate = 1; // Speed (default is 1, range: 0.1 to 10)
                speech.pitch = 1; // Pitch (default is 1, range: 0 to 2)

                // Speak the text
                window.speechSynthesis.speak(speech);

                // Set styling
                const color = Math.floor(Math.random()*16777215).toString(16);
                ctx.lineWidth = 20;
                ctx.strokeStyle = '#' + color
                ctx.font = '18px Arial';

                // Draw rectangles and text
                ctx.beginPath();   
                ctx.fillStyle = '#' + color
                ctx.fillText(text, x, y);
                ctx.rect(x, y, width, height); 
                ctx.stroke();
            });
    }catch(error:any){
        console.log(error.message)
    }
}
