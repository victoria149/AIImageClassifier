from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io

model = load_model('apples_tomatoes_model.h5')

app = Flask(__name__)
CORS(app)

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))  # Anpassen an deine img_size
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Kein Bild hochgeladen'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Dateiname fehlt'}), 400

    try:
        img_bytes = file.read()
        img = preprocess_image(img_bytes)
        prediction = model.predict(img)[0][0]  # Für binary classification

        tomato_probability = prediction * 100
        apple_probability = (1 - prediction) * 100

        # Beste Klasse bestimmen
        predicted_class = 1 if prediction > 0.5 else 0
        class_name = 'Tomato' if predicted_class == 1 else 'Apple'

        predicted_class = 1 if prediction > 0.5 else 0
        return jsonify({
            'prediction': class_name,
            'scores': [
                {"label": "Apple", "score": round(apple_probability, 2)},
                {"label": "Tomato", "score": round(tomato_probability, 2)}
            ]
        })
    except Exception as e:
        import traceback
        traceback.print_exc()  # <-- Fehler im Terminal ausgeben!
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)