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
from app.schemas import ImageData, CourseBase, StudentBase, TakesBase
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
        stmt = text("UPDATE student SET last_login = NOW() WHERE student_id = :student_id")
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

@app.get("/email-info")
async def email_info(db: dp_dependency, current_user: dict = Depends(get_current_user)):
    student_id = current_user.get("sub")
    stmt_email = text("SELECT email FROM student WHERE student_id = :student_id")
    result = db.execute(stmt_email, {"student_id":student_id}).fetchone()
    if result is None:
        return {"Error": "Student not found"}
    else:
        email = result[0]
        
        # TODO: Get the information about the class with sql query
        

        try:
            send_email_info(email,
                            "Your attendance report",
                            "Testing this out"
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
    db_course = models.Course(code=course.code, semester=course.semester, academic_year=course.academic_year, name=course.name, moodle_link=course.moodle_link)
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
    stmt_student = text("SELECT * FROM student WHERE student_id = :student_id")
    stmt_courses = text("SELECT * FROM takes WHERE student_id = :student_id")
    result_student = db.execute(stmt_student, {"student_id":student_id}).fetchone()
    result_courses = db.execute(stmt_courses, {"student_id":student_id}).fetchall()
    if result_student is None:
        return {"message": "Student not found"}
    else:
        #unpack the result from row first
        student_id, student_name, email, last_login, last_active = result_student
        courses = []
        for course in result_courses:
            course_id = course[1]
            stmt_course = text("SELECT * FROM course WHERE course_id = :course_id")
            stmt_class = text("SELECT * FROM class WHERE course_id = :course_id")
            stmt_note = text("SELECT * FROM note WHERE course_id = :course_id")
            result_course = db.execute(stmt_course, {"course_id":course_id}).fetchone()
            result_class = db.execute(stmt_class, {"course_id":course_id}).fetchall()
            result_note = db.execute(stmt_note, {"course_id":course_id}).fetchall()
            if result_course is None:
                return {"message": "Course not found"}
            else:
                #unpack the result from row first
                course_id, code, semester, academic_year, name, moodle_link = result_course
                classes = []
                notes = []
                for note in result_note:
                    note_id, course_id, title, note_link = note
                    notes.append({"note_id":note_id, "course_id":course_id, "title":title, "note_link":note_link})
                for class_ in result_class:
                    class_id,course_id, teacher_message, location, day, type, zoom_link, start_date, end_date, start_time, end_time = class_
                    total_seconds = start_time.total_seconds()

                    # Convert boolean "type" to Lecture/Tutorial [0: Tut, 1: Lec]
                    type = 'Lecture' if (int(type)) else 'Tutorial' 

                    # Convert to hours, minutes, and seconds
                    hours, remainder = divmod(total_seconds, 3600)
                    minutes, _ = divmod(remainder, 60)

                    # Format as a string
                    start_time = f"{int(hours):02}:{int(minutes):02}"
                    total_seconds = end_time.total_seconds()
                    hours, remainder = divmod(total_seconds, 3600)
                    minutes, _ = divmod(remainder, 60)
                    end_time = f"{int(hours):02}:{int(minutes):02}"

                    
                    classes.append({"class_id":class_id, "course_id":course_id, "teacher_message":teacher_message, "location":location, "day":day, "type":type, "zoom_link":zoom_link, "start_date":start_date, "end_date":end_date, "start_time":start_time, "end_time":end_time})
                courses.append({"course_id":course_id, "code":code, "semester":semester, "academic_year":academic_year, "name":name, "moodle_link":moodle_link, "classes":classes, "notes":notes})
        return {"student_id":student_id, "name":student_name, "email":email, "last_login":last_login, "last_active":last_active, "courses":courses}