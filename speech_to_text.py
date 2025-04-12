import whisper

model = whisper.load_model("base")  # Use "tiny" for faster loading/testing

def transcribe_audio(path):
    result = model.transcribe(path)
    return result['text']
