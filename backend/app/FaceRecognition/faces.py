import numpy as np
import cv2
import pickle
import base64


# Load recognize and read label from model
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read("app/FaceRecognition/train.yml")

labels = {"person_name": 1}
with open("app/FaceRecognition/labels.pickle", "rb") as f:
    labels = pickle.load(f)
    labels = {v: k for k, v in labels.items()}

face_cascade = cv2.CascadeClassifier('app/FaceRecognition/haarcascade/haarcascade_frontalface_default.xml')


def recognise_face(image_data):
    image_bytes = base64.b64decode(image_data)
    np_array = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.5, minNeighbors=5)

    for (x, y, w, h) in faces:
        roi_gray = gray[y:y + h, x:x + w]
        # predict the id and confidence for faces
        id_, conf = recognizer.predict(roi_gray)

        # If the face is recognized
        if conf >= 60:
            student_id = labels[id_]
            return student_id

    # If the face is unrecognized
    return None