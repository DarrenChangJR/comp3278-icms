# This file contains the database connection and the database models
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Connect to the database 
# Note: replace the password and database name with your own
# EG. mysql+mysqlconnector://root:password@localhost/database_name
URL_database = "mysql+mysqlconnector://root:password@localhost:/comp3278"

engine = create_engine(URL_database)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()