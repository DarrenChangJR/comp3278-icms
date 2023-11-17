from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
import app.models as models
from app.database import engine, SessionLocal
from app.schemas import ImageData, CourseBase, StudentBase, TakesBase
from sqlalchemy.orm import Session
from sqlalchemy import text, insert
from app.FaceRecognition.faces import recognise_face


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


# main page route (could be used for login?)
@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/login")
async def login(login_request: ImageData):
    image_data = login_request.image_data.replace("data:image/jpeg;base64,", "")
    result = recognise_face(image_data)
    return result

# route for sending email?

# route for populating DB
# @app.post("/populate")
# async def populate_db(db: dp_dependency):

 
# creating database with API calls
# Note StudentBase is a pydantic model
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

@app.get('/student/{student_id}')
async def get_student(student_id: int, db: dp_dependency):
    stmt_student = text("SELECT * FROM student WHERE student_id = :student_id")
    stmt_courses = text("SELECT * FROM takes WHERE student_id = :student_id")
    result_student = db.execute(stmt_student, {"student_id":student_id}).fetchone()
    result_courses = db.execute(stmt_courses, {"student_id":student_id}).fetchall()
    if result_student is None:
        return {"message": "Student not found"}
    else:
        #unpack the result from row first
        student_id, name, email, last_login, last_logout = result_student
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
                    note_id, course_id,note = note
                    notes.append({"note_id":note_id, "course_id":course_id, "note":note})
                for class_ in result_class:
                    class_id,course_id, teacher_message, location, day, type, zoom_link, start_time, end_time = class_
                    classes.append({"class_id":class_id, "course_id":course_id, "teacher_message":teacher_message, "location":location, "day":day, "type":type, "zoom_link":zoom_link, "start_time":start_time, "end_time":end_time})
                courses.append({"course_id":course_id, "code":code, "semester":semester, "academic_year":academic_year, "name":name, "moodle_link":moodle_link, "classes":classes, "notes":notes})
        return {"student_id":student_id, "name":name, "email":email, "last_login":last_login, "last_logout":last_logout, "courses":courses}