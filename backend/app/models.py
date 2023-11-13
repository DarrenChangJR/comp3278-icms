# The Table used for the database is defined in backend/models.py:
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Table
from sqlalchemy.orm import relationship, column_property, composite
from app.database import Base

# Composite attribute for Course
# https://docs.sqlalchemy.org/en/14/orm/composites.html
class Offer_in(object):
    def __init__(self,semester,academic_year):
        self.semester = semester
        self.academic_year = academic_year
    
    def __composite_values__(self):
        return self.semester, self.academic_year

    def __repr__(self):
        return f"Offer_in(x={self.semester!r}, y={self.academic_year!r})"

    def __eq__(self, other):
        return isinstance(other, Offer_in) and other.semester == self.semester and other.academic_year == self.academic_year

    def __ne__(self, other):
        return not self.__eq__(other)

# association table to connect the Student and Course table
Takes = Table('takes', Base.metadata,
    Column('student_id', Integer, ForeignKey('student.student_id')),
    Column('course_id', Integer, ForeignKey('course.course_id'))
)

class Student(Base):
    #initialize the table
    __tablename__ = "student"
    student_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), nullable=False)
    email = Column(String(64), nullable=False, unique=True)
    last_login = Column(DateTime, nullable=False)
    last_logout = Column(DateTime, nullable=False)
    
    #derived attribute 
    last_stay_for = column_property(last_logout - last_login)
    
    # many to many relationship with course table
    take_course = relationship("Course", secondary=Takes, back_populates="has_student")
    
class Course(Base):
    
    __tablename__ = "course"
    course_id = Column(Integer, primary_key=True, index=True)
    code = Column(String(64), nullable=False)
    semester = Column(String(64), nullable=False)
    academic_year = Column(String(64), nullable=False)
    offer_in = composite(Offer_in, semester, academic_year)
    name = Column(String(128), nullable=False)
    moodle_link = Column(String(128), nullable=False)
    
    # one to many relationship with note table
    notes = relationship("Note", back_populates="course")
    
    # one to many relationship with class table
    classes = relationship("Class", back_populates="course")
    
class Note(Base):
    __tablename__ = "note"
    course_id = Column(Integer, ForeignKey("course.course_id"), primary_key=True)
    notes = Column(String(128), primary_key=True, nullable=False)

class Class(Base):
    __tablename__ = "class"
    # for composite primary key, use primary_key=True in both columns
    #https://docs.sqlalchemy.org/en/20/faq/ormconfiguration.html
    class_id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("course.course_id"),primary_key=True)
    
    teacher_message = Column(String(256), nullable=False)
    location = Column(String(64), nullable=False)
    day = Column(String(64), nullable=False)
    type = Column(String(64), nullable=False) #could be boolean for lecture or tutorial
    zoom_link = Column(String(128), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
