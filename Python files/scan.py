from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import pytesseract
import numpy as np
import tempfile
import os
from PIL import Image
from pytesseract import Output

app = Flask(__name__)
CORS(app)

plateCascade = cv2.CascadeClassifier(".venv\Scripts\model.xml")
minArea = 500

@app.route('/scan', methods=['POST'])
def scan():
    try:
        image_file = request.files['image']
        temp_dir = tempfile.gettempdir()
        img_path = os.path.join(temp_dir, image_file.filename)
        image_file.save(img_path)
        print("Screenshot received. Saved at: ", img_path)

        img = cv2.imread(img_path)
        cv2.imwrite("1_original.jpg", img)  # Save original image

        imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        cv2.imwrite("2_gray.jpg", imgGray)  # Save grayscale image

        numberPlates = plateCascade.detectMultiScale(imgGray, 1.1, 4)

        for (x, y, w, h) in numberPlates:
            area = w*h
            if area > minArea:
                cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
                #cv2.putText(img,"NumberPlate",(x,y-5),cv2.FONT_HERSHEY_COMPLEX,1,(0,0,255),2)
                imgRoi = img[y:y+h,x:x+w]
        cv2.imwrite("3_plate.jpg", imgRoi)  # Save image with detected plate

        gray = cv2.cvtColor(imgRoi, cv2.COLOR_BGR2GRAY)  # Convert image to grayscale
        gray = cv2.bilateralFilter(gray, 13, 15, 15) # Apply bilateral filter
        edged = cv2.Canny(gray, 30, 200)  # Apply Canny edge detection
        cv2.imwrite("edged.jpg", edged) 
        cv2.imwrite("4_filtered.jpg", gray)  # Save filtered image
        # Apply adaptive threshold to isolate the plate
        binary = cv2.adaptiveThreshold(gray,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY,11,2)
        cv2.imwrite("4_binary.jpg", binary)  # Save binary image

        # Convert the image to PIL format
        im_pil = Image.fromarray(binary)

        # Run OCR on the binary image
        custom_config = r'--oem 3 --psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        text = pytesseract.image_to_string(gray, config=custom_config)

        print("Detected license plate Number is:",text)

        return {"license_plates": [text]}        

    except Exception as e:
        print("An error occurred: ", str(e))
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5001)
