from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date, time


class ImageData(BaseModel):
    image_data: str


class NoteBase(BaseModel):
    course_id: int
    title: str
    note_link: str
    
    class Config:
        from_attributes = True


class ClassBase(BaseModel):
    teacher_message: str
    location: str
    day: str
    type: str
    zoom_link: str
    start_date: date
    end_date: date
    start_time: time
    end_time: time
    
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
    last_active: datetime
    
    class Config:
        from_attributes = True


class TakesBase(BaseModel):
    student_id: int
    course_id: int
    
    class Config:
        from_attributes = True

class EmailData(BaseModel):
    class_id: int
    course_id: int
    class_date: str
