export {};

declare global {
  interface Window {
    SpeechRecognition: any; // or the specific type if you know it
    webkitSpeechRecognition: any; // or the specific type if you know it
  }
}
