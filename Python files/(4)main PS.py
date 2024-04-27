from flask import Flask
from flask_socketio import SocketIO, emit
import cv2
import pickle
import cvzone
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins=['http://localhost:5003', 'http://localhost:5173'])

with open('.venv\\Scripts\\slots data\\CarParkPos', 'rb') as f:
    posList = pickle.load(f)

width, height = 107, 48

def checkParkingSpace(imgPro, img):
    spaceCounter = 0

    for pos in posList:
        x, y = pos
        imgCrop = imgPro[y:y + height, x:x + width]
        count = cv2.countNonZero(imgCrop)

        if count < 900:
            color = (0, 255, 0)
            thickness = 5
            spaceCounter += 1
        else:
            color = (0, 0, 255)
            thickness = 2
            
        cv2.rectangle(img, pos, (pos[0] + width, pos[1] + height), color, thickness)
        cvzone.putTextRect(img, str(count), (x, y + height - 3), scale=1,
                            thickness=2, offset=0, colorR=color)
    # cvzone.putTextRect(img, f'Free: {spaceCounter}/{len(posList)}', (100, 50), scale=3,
    #                        thickness=5, offset=20, colorR=(0,200,0))
    return spaceCounter, img

@socketio.on('video frame')
def handle_frame(data):
    # Convert base64 image to OpenCV image
    nparr = np.fromstring(base64.b64decode(data['frame']), np.uint8)
    
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    
    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(imgGray, (3, 3), 1)
    imgThreshold = cv2.adaptiveThreshold(imgBlur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                         cv2.THRESH_BINARY_INV, 25, 16)
    imgMedian = cv2.medianBlur(imgThreshold, 5)
    kernel = np.ones((3, 3), np.uint8)
    imgDilate = cv2.dilate(imgMedian, kernel, iterations=1)

    freeSpaces, imgWithRectangles = checkParkingSpace(imgDilate, img)
    
    # Convert processed image to base64
    _, buffer = cv2.imencode('.jpg', imgWithRectangles)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    emit('free spaces', {'freeSpaces': freeSpaces, 'image': img_base64})

if __name__ == '__main__':
    socketio.run(app, port=5003)