from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel, OrmModel
from typing import Annotated, Optional
import app.models as models
from app.database import engine, SessionLocal
from sqlalchemy.orm import Session
import io
from PIL import Image
import base64
from datetime import datetime

app = FastAPI()

# create the database tables
models.Base.metadata.create_all(bind=engine)

# we need to create pydantic models for the data we want to receive and send with the route post & get requests
# Note: we use OrmModel as there is relationship involved in the database

class NoteBase(OrmModel):
    note: str
    
    class Config:
        orm_mode = True

class ClassBase(OrmModel):
    class_id: Optional [int]
    class_teacher_message: str
    class_location: str
    class_day: str
    class_type: str
    class_zoom_link: str
    class_start_time: datetime
    class_end_time: datetime
    
    class Config:
        orm_mode = True
        
class CourseBase(OrmModel):
    course_id: int
    course_code: str
    semester: str
    academic_year: str
    course_name: str
    course_moodle_link: str
    
    # one to many relationship with note table & class table
    course_notes: Optional[list["NoteBase"]] = None
    course_classes: Optional[list["ClassBase"]] = None
    
    class Config:
        orm_mode = True
        
# For checking whether data is valid when initializing a new student
class StudentBase(OrmModel):
    student_id: Optional[int]
    student_name: str
    student_email: str
    student_last_login: datetime
    student_last_logout: datetime
    student_last_stay_for: datetime
    
    class Config:
        orm_mode = True

# Many to Many relationship pydantic model https://www.gormanalysis.com/blog/many-to-many-relationships-in-fastapi/
# Setting up extra model to prevent circular dependency issue
class StudentSchema(StudentBase):
    take_course: Optional[list[CourseBase]] = None
    
    class Config:
        orm_mode = True
class CourseSchema(CourseBase):
    has_student: Optional[list[StudentBase]] = None
    
    class Config:
        orm_mode = True


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
@app.post("/populate")
async def populate_db(db: dp_dependency):

 
# creating database with API calls
# Note StudentBase is a pydantic model
# @app.post("/student")
# async def create_student(student: StudentBase, db: dp_dependency):
#     db_student = models.student(**student.dict())
#     db.add(db_student)
#     db.commit()
#     db.refresh(db_student) 