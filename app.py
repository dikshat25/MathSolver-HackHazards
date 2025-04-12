from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import subprocess
import groq
from werkzeug.utils import secure_filename
from speech_to_text import transcribe_audio
from flask_cors import CORS

# -----------------------------
# Environment setup
# -----------------------------
load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
 # This will allow all origins by default
client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))

# -----------------------------
# Folder setup for uploads
# -----------------------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# -----------------------------
# Check if ffmpeg is installed
# -----------------------------
def check_ffmpeg():
    try:
        subprocess.run(["ffmpeg", "-version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("✅ FFmpeg is available.")
    except Exception as e:
        raise RuntimeError("❌ FFmpeg is not installed or not found in PATH. Please install it and try again.") from e

check_ffmpeg()

# -----------------------------
# Routes
# -----------------------------

@app.route("/")
def index():
    return "MathGen API is running!"


@app.route('/explain', methods=['POST'])
def explain():
    user_input = request.json.get('question')
    if not user_input:
        return jsonify({"error": "No question provided"}), 400

    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": user_input}],
        model="llama3-8b-8192"
    )
    reply = chat_completion.choices[0].message.content
    return jsonify({"answer": reply})

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        print("No audio part")
        return jsonify({"error": "No audio file part"}), 400

    file = request.files['audio']
    if file.filename == '':
        print("No selected file")
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    print(f"File saved to {filepath}")

    try:
        text = transcribe_audio(filepath)
        print(f"Transcription result: {text}")
        if not text:
            raise ValueError("Transcription is empty")
        return jsonify({"transcription": text})
    except Exception as e:
        print(f"Transcription failed: {e}")
        return jsonify({"error": f"Transcription failed: {str(e)}"}), 500

# -----------------------------
# Start the server
# -----------------------------
if __name__ == '__main__':
    app.run(debug=True)
