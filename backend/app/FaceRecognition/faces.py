import numpy as np
import mysql.connector
import cv2
import pickle
from datetime import datetime
import base64
from dotenv import load_dotenv
import os

load_dotenv()

# Get environment variables
host = os.getenv("DB_HOST")
user = os.getenv("DB_USER")
passwd = os.getenv("DB_PASSWORD")
database = os.getenv("DB_NAME")

# Create database connection
myconn = mysql.connector.connect(host=host, user=user, passwd=passwd, database=database)
cursor = myconn.cursor()


# 2 Load recognize and read label from model
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read("app/FaceRecognition/train.yml")

labels = {"person_name": 1}
with open("app/FaceRecognition/labels.pickle", "rb") as f:
    labels = pickle.load(f)
    labels = {v: k for k, v in labels.items()}

face_cascade = cv2.CascadeClassifier('app/FaceRecognition/haarcascade/haarcascade_frontalface_default.xml')


def recognise_face(image_data):
    current_datetime = datetime.now()
    image_bytes = base64.b64decode(image_data)
    np_array = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.5, minNeighbors=5)

    for (x, y, w, h) in faces:
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = frame[y:y + h, x:x + w]
        # predict the id and confidence for faces
        id_, conf = recognizer.predict(roi_gray)

        # If the face is recognized
        if conf >= 60:
            student_id = labels[id_]

            # Update the data in database
            update =  "UPDATE student SET last_login=%s WHERE student_id=%s"
            val = (current_datetime, student_id)
            cursor.execute(update, val)
            myconn.commit()

            return {"access_token": student_id}

        # If the face is unrecognized
        else:
            return {"Error": "Face not recognized"}