from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import Annotated
import app.models as models
from app.database import engine, SessionLocal
from sqlalchemy.orm import Session
import io
from PIL import Image
import base64

app = FastAPI()

# create the database tables
models.Base.metadata.create_all(bind=engine)

# we need to create pydantic models for the data we want to receive and send with the route post & get requests

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

 
# creating database with API calls
# Note StudentBase is a pydantic model
# @app.post("/student")
# async def create_student(student: StudentBase, db: dp_dependency):
#     db_student = models.student(**student.dict())
#     db.add(db_student)
#     db.commit()
#     db.refresh(db_student) 