from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
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

@app.route('/creat_grp', methods=['GET', 'POST'])
def creat_grp():
    if request.method == 'POST':
        group_name = request.form.get('grp_name')
        num_players = int(request.form.get('num_players', 1))  # Default to 1

        # Retrieve user fields dynamically
        users = [request.form.get(f'user{i}', None) for i in range(1, num_players + 1)]

        # Fill the remaining fields with defaults (if fewer than 5 players)
        while len(users) < 5:
            users.append(None)

        new_grp = stgrp(
            name=group_name,
            user1=users[0], user2=users[1],
            user3=users[2], user4=users[3], user5=users[4]
        )

        db.session.add(new_grp)
        db.session.commit()
        flash('Registered new group!', 'success')
        return redirect(url_for('dashboard'))

    return render_template('creat_grp.html')


@app.route('/space_shooter')
def space_shooter():
    return render_template("space_shooter.html")


from googleapiclient.discovery import build
def fetch_youtube_videos(api_key, query, max_results=10):
    youtube = build('youtube', 'v3', developerKey=api_key)
    request = youtube.search().list(
        part="snippet",
        q=query,
        type="video",
        maxResults=max_results
    )
    response = request.execute()
    videos = []
    for item in response.get('items', []):
        videos.append({
            'title': item['snippet']['title'],
            #'thumbnail': item['snippet']['thumbnails']['high']['url'],
            'video_url': f"https://www.youtube.com/embed/{item['id']['videoId']}"
        })
    return videos
@app.route('/vid',methods=['GET','POST'])
def vid():
    if request.method=='POST':
        search=request.form['search']
        API_KEY = "AIzaSyBoRs5EvF3_Zn8X5j0ebz1mpWojq-CWGkI"
        QUERY = search
        videos = fetch_youtube_videos(API_KEY, QUERY)
        return render_template('vid.html', videos=videos)
    return render_template('vid.html')

@app.route('/skills')
def skills():
    return render_template("skills.html")

















if __name__ == '__main__':
    app.run(debug=True)
