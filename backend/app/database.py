# This file contains the database connection and the database models
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

# Connect to the database 
URL_database = os.getenv("DB_URL")

engine = create_engine(URL_database)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

# drop and recreate the database tables from the models
metadata = MetaData()
metadata.reflect(engine)
metadata.drop_all(engine)
