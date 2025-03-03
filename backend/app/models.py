from sqlalchemy import Column, Integer, Boolean, String, ForeignKey, DateTime, Table, Date, Time
from sqlalchemy.orm import relationship, composite
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

# association table to connect the Staff and Course table
Teaches = Table('teaches', Base.metadata,
    Column('staff_id', Integer, ForeignKey('staff.staff_id')),
    Column('course_id', Integer, ForeignKey('course.course_id'))
)


class Student(Base):
    #initialize the table
    __tablename__ = "student"
    student_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), nullable=False)
    email = Column(String(64), nullable=False, unique=True)
    last_login = Column(DateTime, nullable=False)
    last_active = Column(DateTime, nullable=False)
    
    #derived attribute 
    @property
    def last_stay_for(self):
        return self.last_active - self.last_login
        
    # many to many relationship with course table
    take_course = relationship("Course", secondary=Takes, back_populates="has_student")


class Course(Base):
    __tablename__ = "course"
    course_id = Column(Integer, primary_key=True, index=True)
    code = Column(String(64), nullable=False)
    semester = Column(String(64), nullable=False)
    academic_year = Column(String(64), nullable=False)
    offer_in = composite(Offer_in, semester, academic_year)
    course_name = Column(String(128), nullable=False)
    moodle_link = Column(String(128), nullable=False)
    
    # notes is a multi-valued attribute of Course
    # one to many relationship with note table
    notes = relationship("Note", back_populates="course")
    
    # one to many relationship with class table
    classes = relationship("Class", back_populates="course")

    # many to many relationship with student table
    has_student = relationship("Student", secondary=Takes, back_populates="take_course")

    # many to many relationship with staff table
    taught_by = relationship("Staff", secondary="teaches", back_populates="teaches")


class Note(Base):
    __tablename__ = "note"
    note_id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("course.course_id"))
    title = Column(String(256), nullable=False)
    note_link = Column(String(256), nullable=False)
    
    # many to one relationship with course table
    course = relationship("Course", back_populates="notes")


class Class(Base):
    __tablename__ = "class"
    # for composite primary key, use primary_key=True in both columns
    #https://docs.sqlalchemy.org/en/20/faq/ormconfiguration.html
    class_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("course.course_id"), primary_key=True)
    
    teacher_message = Column(String(256), nullable=False)
    location = Column(String(64), nullable=False)
    day = Column(String(64), nullable=False)
    type = Column(Boolean, nullable=False) # True for lecture, False for tutorial
    zoom_link = Column(String(128), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    # many to one relationship with course table
    course = relationship("Course", back_populates="classes")


class Staff(Base):
    __tablename__ = "staff"
    staff_id = Column(Integer, primary_key=True, index=True)
    staff_name = Column(String(64), nullable=False)
    staff_email = Column(String(64), nullable=False, unique=True)
    role = Column(String(64), nullable=False)
    office_location = Column(String(64), nullable=False)
    office_hours = Column(String(64), nullable=False)
    
    # many to many relationship with course table
    teaches = relationship("Course", secondary="teaches", back_populates="taught_by")