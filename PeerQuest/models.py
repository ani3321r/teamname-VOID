from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"
    
class stgrp(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(50), nullable=False, unique=True)
    user1=db.Column(db.String(100), nullable=True, unique=True)
    user2=db.Column(db.String(100), nullable=True, unique=True, default="user2")
    user3=db.Column(db.String(100), nullable=True, unique=True, default="user3")
    user4=db.Column(db.String(100), nullable=True, unique=True, default="user4")
    user5=db.Column(db.String(100), nullable=True, unique=True, default="user5")
    user1_role=db.Column(db.String(100), nullable=True, unique=True)
    user2_role=db.Column(db.String(100), nullable=True, unique=True)
    user3_role=db.Column(db.String(100), nullable=True, unique=True)
    user4_role=db.Column(db.String(100), nullable=True, unique=True)
    user5_role=db.Column(db.String(100), nullable=True, unique=True)

