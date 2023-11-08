# The Table used for the database is defined in backend/models.py:
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
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
class Takes(Base):
    __tablename__ = "takes"
    student_id = Column(Integer, ForeignKey("student.student_id"), primary_key=True)
    course_id = Column(Integer, ForeignKey("course.course_id"), primary_key=True)
    
class Student(Base):
    #initialize the table
    __tablename__ = "student"
    student_id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String(64), nullable=False)
    student_email = Column(String(64), nullable=False)
    student_last_login = Column(DateTime, nullable=False)
    student_last_logout = Column(DateTime, nullable=False)
    
    #derived attribute 
    student_last_stay_for = column_property(student_last_logout - student_last_login)
    
    #relationship with course table
    take_course = relationship("Course", secondary=Takes, back_populates="has_student")
    
class Course(Base):
    
    __tablename__ = "course"
    course_id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String(64), nullable=False)
    semester = Column(String(64), nullable=False)
    academic_year = Column(String(64), nullable=False)
    course_offer_in = composite(Offer_in, semester, academic_year)
    course_name = Column(String(128), nullable=False)
    course_moodle_link = Column(String(128), nullable=False)
    
    # one to many relationship with note table
    course_notes = relationship("Note", back_populates="course")
    
    # one to many relationship with class table
    course_classes = relationship("Class", back_populates="course")
    
class Note(Base):
    __tablename__ = "note"
    course_id = Column(Integer, ForeignKey("course.course_id"), primary_key=True)
    notes = Column(String(128), primary_key=True, nullable=False)

class Class(Base):
    __tablename__ = "class"
    # for composite primary key, use primary_key=True in both columns
    #https://docs.sqlalchemy.org/en/20/faq/ormconfiguration.html
    class_id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey("course.course_id"),primary_key=True)
    
    class_teacher_message = Column(String(256), nullable=False)
    class_location = Column(String(64), nullable=False)
    class_day = Column(String(64), nullable=False)
    class_type = Column(String(64), nullable=False) #could be boolean for lecture or tutorial
    class_zoom_link = Column(String(128), nullable=False)
    class_start_time = Column(DateTime, nullable=False)
    class_end_time = Column(DateTime, nullable=False)


    
    
    
    
    
    