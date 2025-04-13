// src/api/transcribeAudio.js
export const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();
  
    // ✅ Create a valid File object with a name so Flask can handle it
    const audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" });
    formData.append("audio", audioFile);
  
    console.log("Sending audio file:", audioFile);

    try {
        const response = await fetch("http://127.0.0.1:5000/transcribe", {
            method: "POST",
            body: formData,
        });
  
        const data = await response.json();
        console.log("Backend Response:", data); // For debugging
        return data.transcription || data.error || "No transcription received.";
    } catch (error) {
        console.error("Error during transcription:", error);
        return "Failed to transcribe.";
    }
};
