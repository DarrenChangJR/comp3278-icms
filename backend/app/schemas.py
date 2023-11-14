from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ImageData(BaseModel):
    image_data: str


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
        

class StudentBase(BaseModel):
    name: str
    email: str
    last_login: datetime
    last_logout: datetime
    
    class Config:
        from_attributes = True


class TakesBase(BaseModel):
    student_id: int
    course_id: int
    
    class Config:
        from_attributes = True
