from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import Annotated, Optional
import app.models as models
from app.database import engine, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import text, insert
import io
from PIL import Image
import base64
from datetime import datetime

app = FastAPI()

# create the database tables and populate them with dummy data
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

# we need to create pydantic models for the data we want to receive and send with the route post & get requests
# Note: we use OrmModel as there is relationship involved in the database

class NoteBase(BaseModel):
    note: str
    course_id: int
    
    class Config:
        from_attributes = True

class ClassBase(BaseModel):
    teacher_message: str
    location: str
    day: str
    type: str
    zoom_link: str
    start_time: datetime
    end_time: datetime
    
    class Config:
        from_attributes = True
        
class CourseBase(BaseModel):
    code: str
    semester: str
    academic_year: str
    name: str
    moodle_link: str
    
    # one to many relationship with note table & class table
    notes: Optional[list["NoteBase"]] = None
    classes: Optional[list["ClassBase"]] = None
    
    class Config:
        from_attributes = True
        
# For checking whether data is valid when initializing a new student
class StudentBase(BaseModel):
    name: str
    email: str
    last_login: datetime
    last_logout: datetime
    
    class Config:
        from_attributes = True

# Takes is a table that is used to implement many to many relationship between student and course
# we need to create a pydantic model for this table
class TakesBase(BaseModel):
    student_id: int
    course_id: int
    
    class Config:
        from_attributes = True


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

class ImageData(BaseModel):
    image_data: str

@app.post("/login")
async def login(login_request: ImageData):
    image_data = login_request.image_data.replace("data:image/jpeg;base64,", "")
    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes))

    # TODO: use image to get student id
    # ofc, fail if student id is not found
    student_id = "12345678"
    return {"access_token": student_id}

# route for successful login

# route for failed login

# route for main page if there is class

# route for main page if there is no class

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