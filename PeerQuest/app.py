from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gd.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = '0123456789'

# Initialize SQLAlchemy
from models import *
db.init_app(app)

# Dummy data for demonstration
user_pods = [
    {"name": "Machine Learning Pod", "role": "Researcher", "progress": "75%"},
    {"name": "Web Development Pod", "role": "Leader", "progress": "50%"}
]
















@app.route('/')
def home():
    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username_or_email = request.form['username_or_email']
        password = request.form['password']

        # Fetch user by username or email
        user = User.query.filter((User.username == username_or_email) | (User.email == username_or_email)).first()

        if user and check_password_hash(user.password, password):
            flash('Login successful!', 'success')
            session['username'] = username_or_email
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username/email or password!', 'error')

    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            flash('Passwords do not match!', 'error')
            return redirect(url_for('register'))

        # Check if username or email already exists
        if User.query.filter((User.username == username) | (User.email == email)).first():
            flash('Username or email already exists!', 'error')
            return redirect(url_for('register'))

        # Hash password and save user
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
        new_user = User(username=username, email=email, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()
        flash('Registration successful!', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    user = session['username']
    return render_template("dashboard.html", username=user, pods=user_pods)

@app.route('/creat_grp',methods=['GET', 'POST'])
def creat_grp():
    if request.method=='POST':
        group_name=request.form['grp_name']
        user1 = request.form['user1']
        user2 = request.form['user2']
        user3 = request.form['user3']
        user4 = request.form['user4']
        user5 = request.form['user5']
        new_grp = stgrp(name=group_name, user1=user1,user2=user2,user3=user3,user4=user4,user5=user5 )

        db.session.add(new_grp)
        db.session.commit()
        flash('Registrated new group!', 'success')
        return redirect(url_for('dashboard'))
    return render_template('creat_grp.html')























if __name__ == '__main__':
    app.run(debug=True)
