import os
import subprocess
import groq
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
import io
import re
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from speech_to_text import transcribe_audio 
from flask_cors import CORS
import sympy as sp  
import time

# -----------------------------
# Environment setup
# -----------------------------
load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
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
# Graph generation function
# -----------------------------
def generate_graph(expression):
    x = sp.symbols('x')

    try:
        func = sp.sympify(expression)
    except sp.SympifyError:
        return None

    x_vals = np.linspace(-10, 10, 400)
    try:
        y_vals = np.array([float(func.subs(x, val)) for val in x_vals])
    except Exception:
        return None

    fig, ax = plt.subplots(figsize=(6, 4))
    ax.plot(x_vals, y_vals, label=f"y = {expression}", color="blue", linewidth=2)
    ax.axhline(0, color='black', linewidth=1.2)
    ax.axvline(0, color='black', linewidth=1.2)
    ax.grid(True, which='both', linestyle='--', linewidth=0.5, alpha=0.7)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title(f"Graph of y = {expression}")
    ax.legend()
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    img_stream = io.BytesIO()
    plt.tight_layout()
    plt.savefig(img_stream, format='png', bbox_inches='tight')
    img_stream.seek(0)

    img_base64 = base64.b64encode(img_stream.read()).decode('utf-8')
    plt.close(fig)
    return img_base64

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
    raw_reply = chat_completion.choices[0].message.content

    cleaned_reply = re.sub(r"```[\s\S]*?```", "", raw_reply)
    cleaned_reply = re.sub(r"([|/_\\-]{2,}|\s{2,})", "", cleaned_reply)
    reply = cleaned_reply.strip()

    if "graph of" in user_input.lower():
        expression = user_input.split("graph of")[-1].strip()
        graph_image = generate_graph(expression)

        if not graph_image:
            return jsonify({
                "answer": "Sorry, I couldn't interpret the function you asked about.",
                "chart": None
            })

        return jsonify({
            "answer": reply,
            "chart": graph_image
        })

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
# Summary
# -----------------------------
@app.route('/summarize', methods=['POST'])
@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    user_text = data.get("text")

    if not user_text:
        return jsonify({"error": "No text provided"}), 400

    # Limit input to reduce token load
    user_text = user_text[:1000]

    prompt = f"Summarize the following content in exactly 2 lines suitable for a student flashcard:\n\n{user_text}"

    try:
        retries = 3
        for attempt in range(retries):
            try:
                chat_completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama3-8b-8192"
                )
                summary = chat_completion.choices[0].message.content.strip()
                return jsonify({"summary": summary})
            except Exception as e:
                error_text = str(e)
                if "rate_limit_exceeded" in error_text and attempt < retries - 1:
                    print("⚠️ Rate limit hit. Retrying in 5 seconds...")
                    time.sleep(5)
                else:
                    raise e

    except Exception as e:
        print(f"❌ Error generating summary: {e}")
        return jsonify({"error": f"Failed to generate summary: {str(e)}"}), 500
    
# Start the server
# -----------------------------
if __name__ == '__main__':
    app.run(debug=True)
