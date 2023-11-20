from datetime import datetime
import json

from typing import Annotated

from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import text, insert
from sqlalchemy.orm import Session

import app.models as models
from app.FaceRecognition.faces import recognise_face
from app.database import engine, SessionLocal
from app.email_utils import send_email_info
from app.schemas import ImageData, CourseBase, StudentBase, TakesBase, EmailData
from app.token_utils import create_access_token, verify_token


app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create the database tables
models.Base.metadata.create_all(bind=engine)
with open("dummy.sql", "r") as file:
    sql_script = file.read()

with engine.connect() as connection:
    # execute the sql script one statement at a time, splitting on the semicolon
    for statement in sql_script.split(";"):
        # skip empty statements
        if statement.strip() == "":
            continue
        # execute the statement
        connection.execute(text(statement))
        connection.commit()


# dependency for database connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

dp_dependency = Annotated[Session, Depends(get_db)]

def get_student_info(db: dp_dependency, student_id):
    stmt = text("""
        SELECT 
            student.*, 
            course.*, 
            class.*, 
            note.*
        FROM 
            student
        INNER JOIN takes ON student.student_id = takes.student_id
        INNER JOIN course ON takes.course_id = course.course_id
        LEFT JOIN class ON course.course_id = class.course_id
        LEFT JOIN note ON course.course_id = note.course_id
        WHERE 
            student.student_id = :student_id
    """)

    execution = db.execute(stmt, {"student_id":student_id})
    result = execution.fetchall()


    if not result:
        return {"message": "Student not found"}
    
    # add keys to result to change from tuples to dicts
    result = [dict(zip(execution.keys(), row)) for row in result]

    courses = {}
    for row in result:
        course_id = row['course_id']
        if course_id not in courses:
            courses[course_id] = {
                "course_id": course_id,
                "code": row['code'],
                "semester": row['semester'],
                "academic_year": row['academic_year'],
                "course_name": row['course_name'],
                "moodle_link": row['moodle_link'],
                "classes": [],
                "notes": [],
                "note_ids": set(),
                "class_ids": set(),
            }

        class_id = row['class_id']
        if class_id not in courses[course_id]['class_ids']:
            courses[course_id]['class_ids'].add(class_id)

            start_time = str(row['start_time'])
            end_time = str(row['end_time'])

            # Extract only the hours and minutes
            start_time = start_time.split(":")[0] + ":" + start_time.split(":")[1]
            end_time = end_time.split(":")[0] + ":" + end_time.split(":")[1]

            courses[course_id]['classes'].append({
                "class_id": row['class_id'],
                "course_id": row['course_id'],
                "teacher_message": row['teacher_message'],
                "location": row['location'],
                "day": row['day'],
                "type": 'Lecture' if (int(row['type'])) else 'Tutorial',
                "zoom_link": row['zoom_link'],
                "start_date": row['start_date'],
                "end_date": row['end_date'],
                "start_time": start_time,
                "end_time": end_time
            })

        note_id = row['note_id']
        if note_id not in courses[course_id]['note_ids']:
            courses[course_id]['note_ids'].add(note_id)
            courses[course_id]['notes'].append({
                "note_id": row['note_id'],
                "course_id": row['course_id'],
                "title": row['title'],
                "note_link": row['note_link']
            })

    # remove note_ids from courses
    for course in courses.values():
        del course['note_ids']
        del course['class_ids']

    return {
        "student_id": row['student_id'],
        "name": row['name'],
        "email": row['email'],
        "last_login": row['last_login'],
        "last_active": row['last_active'],
        "courses": list(courses.values())
    }


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# main page route (could be used for login?)
@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/login")
async def login(login_request: ImageData, db: dp_dependency):
    image_data = login_request.image_data.replace("data:image/jpeg;base64,", "")
    student_id = recognise_face(image_data)
    if student_id is not None:
        # update last_login, and last_active to be 1 minute after last_login
        stmt = text("UPDATE student SET last_login = NOW(), last_active = NOW() + INTERVAL 1 MINUTE WHERE student_id = :student_id")
        db.execute(stmt, {"student_id":student_id})
        db.commit()
        token = create_access_token(data={"sub": student_id})
        return {"access_token": token, "token_type": "bearer"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/email-info")
async def email_info(db: dp_dependency, email_data: EmailData, current_user: dict = Depends(get_current_user)):
    student_id = current_user.get("sub")
    stmt_email = text("SELECT email FROM student WHERE student_id = :student_id")
    stmt_name = text("SELECT name FROM student WHERE student_id = :student_id")
    result = db.execute(stmt_email, {"student_id":student_id}).fetchone()
    name = db.execute(stmt_name, {"student_id":student_id}).fetchone()
    name = name[0]
    if result is None:
        return {"Error": "Student not found"}
    else:
        email = result[0]
        
        # TODO: Get the information about the class with sql query
        class_id = int(email_data.class_id)
        course_id = int(email_data.course_id)
        class_date = email_data.class_date
        content = get_student_info(db,student_id)
        # keep the content with same class_id and course_id in content remove other
        filtered_courses = []
        for course in content["courses"]:
            if course["course_id"] == course_id:
                filtered_classes = [class_ for class_ in course["classes"] if class_["class_id"] == class_id]
                if filtered_classes:
                    course["classes"] = filtered_classes
                    filtered_courses.append(course)
        content["courses"] = filtered_courses
        content["class_date"] = class_date
        # change the datetime object to string
        for course in content["courses"]:
            for class_ in course["classes"]:
                #strftime('%Y-%m-%d %H:%M:%S')
                class_["start_date"] = class_["start_date"].strftime('%Y-%m-%d')
                class_["end_date"] = class_["end_date"].strftime('%Y-%m-%d')
                # class_["start_time"] = class_["start_time"].strftime('%H:%M:%S')
                # class_["end_time"] = class_["end_time"].strftime('%H:%M:%S')
        content["last_login"] = content["last_login"].strftime('%Y-%m-%d %H:%M:%S')
        content["last_active"] = content["last_active"].strftime('%Y-%m-%d %H:%M:%S')
        content = json.dumps(content, indent=4)

        

        title =name + "'s class information"
        # change every datetime object to string
        try:
            send_email_info(email,
                            title,
                            content
            )
            return {"Completion": "success"} 
        except Exception as e:
            print(f"An error occurred: {e}")
            return {"Error": "Failure to send email"}

@app.head("/ping")
async def ping(db: dp_dependency, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")
    stmt = text("UPDATE student SET last_active = NOW() WHERE student_id = :student_id")
    db.execute(stmt, {"student_id": user_id})
    db.commit()
    return Response(status_code=200)
 
# creating database with API calls
@app.post("/create_student")
async def create_student(student: StudentBase, db: dp_dependency):
    db_student = models.Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)

@app.post("/create_course")
async def create_course(course: CourseBase, db: dp_dependency):
    db_course = models.Course(code=course.code, semester=course.semester, academic_year=course.academic_year, course_name=course.course_name, moodle_link=course.moodle_link)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    # create notes
    for note in course.notes:
        db_note = models.Note(**note.model_dump())
        db_note.course_id = db_course.course_id
        db.add(db_note)
        db.commit()
        db.refresh(db_note)
    # create classes
    for class_ in course.classes:
        db_class = models.Class(**class_.model_dump())
        db_class.course_id = db_course.course_id
        db.add(db_class)
        db.commit()
        db.refresh(db_class)

@app.post("/create_take")
async def create_take(take: TakesBase, db: dp_dependency):
    stmt = insert(models.Takes).values(student_id=take.student_id, course_id=take.course_id)
    db.execute(stmt)
    db.commit()

@app.get('/student/me')
async def get_student(db: dp_dependency, current_user: dict = Depends(get_current_user)):
    student_id = current_user.get("sub")
    return get_student_info(db,student_id)