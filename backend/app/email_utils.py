from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
from email.mime.text import MIMEText
import base64
import os
import json


# Send the email
# If modifying these SCOPES, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/gmail.send']


def create_message(sender, to, subject, message_text):
    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    return {'raw': base64.urlsafe_b64encode(message.as_string().encode()).decode()}

def get_email_details(stdInfo, class_id, course_id, class_date):
    filtered_courses = []
    for course in stdInfo["courses"]:
        if course["course_id"] == course_id:
            filtered_classes = [class_ for class_ in course["classes"] if class_["class_id"] == class_id]
            if filtered_classes:
                course["classes"] = filtered_classes
                filtered_courses.append(course)
    stdInfo["courses"] = filtered_courses
    stdInfo["class_date"] = class_date
    # change the datetime object to string
    for course in stdInfo["courses"]:
        for class_ in course["classes"]:
            # strftime('%Y-%m-%d %H:%M:%S')
            class_["start_date"] = class_["start_date"].strftime('%Y-%m-%d')
            class_["end_date"] = class_["end_date"].strftime('%Y-%m-%d')
            # class_["start_time"] = class_["start_time"].strftime('%H:%M:%S')
            # class_["end_time"] = class_["end_time"].strftime('%H:%M:%S')
    stdInfo["last_login"] = stdInfo["last_login"].strftime('%Y-%m-%d %H:%M:%S')
    stdInfo["last_active"] = stdInfo["last_active"].strftime('%Y-%m-%d %H:%M:%S')
    stdInfo = json.dumps(stdInfo, indent=4)
    return stdInfo


def write_message(details):
    Days = {"1": "Monday", "2": "Tuesday", "3": "Wednesday", "4": "Thursday", "5": "Friday"}
    details = json.loads(details)
    msg = "Dear " + details["name"] + ",\n"
    # Add all classes
    for course in details["courses"]:
        for class_ in course["classes"]:
            msg += "You have a class on " + Days[class_["day"]] + ", " + details["class_date"] + " from " + class_["start_time"] + " to " + class_["end_time"] + ". "
            msg += "It will be a " + str(class_["type"]).lower()
            msg += " and class is to be held at " + class_["location"] + "."
            msg += " The teacher's message for you is \"" + class_["teacher_message"] + "\".\n"
            if (class_["zoom_link"] != None):
                msg += "The zoom link for the class is \n\t" + class_["zoom_link"] + "\n"
    # Add all notes
    msg += "\nYou have the following notes for this class:\n"
    for course in details["courses"]:
        for note in course["notes"]:
            msg += note["title"] + ":\n"
            msg += note["note_link"] + "\n\n"
    return msg

def send_message(service, user_id, message):
    try:
        message = (service.users().messages().send(userId=user_id, body=message).execute())
        return message
    except HttpError as error:
        print('An error occurred: %s' % error)

def send_email(sender, to, subject, message_text):
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
            
    service = build('gmail', 'v1', credentials=creds)
    message = create_message(sender, to, subject, message_text)
    send_message(service, "me", message)

def send_email_info(email, subject, message_text):
    sender = "comp3278t@gmail.com"
    send_email(sender, email, subject, message_text)