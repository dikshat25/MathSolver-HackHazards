import whisper
import subprocess
import os

model = whisper.load_model("base")  # Use "tiny" for faster loading/testing

def transcribe_audio(path):
    try:
        # Convert audio to .wav using system ffmpeg
        converted_path = path.rsplit('.', 1)[0] + '.wav'
        command = [
            "ffmpeg", "-y", "-i", path,
            "-ar", "16000",  # sample rate required by Whisper
            "-ac", "1",      # mono channel
            converted_path
        ]
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"✅ Audio converted to {converted_path}")

        # Transcribe using Whisper
        result = model.transcribe(converted_path)
        return result['text']
    except Exception as e:
        print(f"❌ Transcription error: {e}")
        raise
