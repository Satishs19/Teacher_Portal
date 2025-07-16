Teacher Portal

==========================
PROJECT OVERVIEW
==========================

A scalable web portal built with Python (Django), HTML/CSS, JavaScript, and PostgreSQL. Teachers can log in securely and manage student records via a clean, interactive interface.


==========================
FEATURES
==========================

- Teacher Login with session-based authentication
- Dashboard showing student list
- Popup form for adding new students
- Inline editing of student records
- Delete functionality for cleanup
- Search filter by name
- If student with same name & subject exists, marks are updated
- Validation on frontend and backend


==========================
TECH STACK
==========================

Backend: Python (Django)
Frontend: HTML, CSS, JavaScript
Database: PostgreSQL
ORM: Django ORM
Security: CSRF protection, input validation


==========================
UI HIGHLIGHTS
==========================

- Responsive home page with action buttons
- Modal popup for adding students
- Editable table rows
- Native CSS styling


==========================
SETUP INSTRUCTIONS
==========================

1. Clone Project
---------------
$ git clone https://github.com/Satishs19/Teacher_Portal.git
$ cd teacher-portal

Or download and extract the ZIP.

2. Create Virtual Environment
-----------------------------
$ python -m venv venv
$ source venv/bin/activate  (Windows: venv\Scripts\activate)

3. Install Dependencies
-----------------------
$ pip install -r requirements.txt


==========================
DATABASE SETUP (PostgreSQL)
==========================

Step 1: Install PostgreSQL
--------------------------
Install locally via pgAdmin or official installer.

Step 2: Create Database and User
--------------------------------
$ psql postgres

CREATE DATABASE teacher_portal;
CREATE USER teacher_user WITH PASSWORD 'securepassword';
GRANT ALL PRIVILEGES ON DATABASE teacher_portal TO teacher_user;

Step 3: Update settings.py
--------------------------
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': 'teacher_portal',
    'USER': 'teacher_user',
    'PASSWORD': 'securepassword',
    'HOST': 'localhost',
    'PORT': '5432'
  }
}

Step 4: Migrate and Create Superuser
------------------------------------
$ python manage.py makemigrations
$ python manage.py migrate
$ python manage.py createsuperuser


==========================
ACCESSING ADMIN PANEL
==========================

1. Start server
   $ python manage.py runserver

2. Visit http://localhost:8000/admin

3. Log in using superuser credentials

4. Add new teacher under "Teachers" section


==========================
VALIDATION LOGIC
==========================

Frontend (JavaScript):
- Fields must not be empty
- Name & Subject: only letters & spaces
- Marks must be numeric

Backend (Python):
- Duplicate student check based on name & subject
- Adds marks instead of duplicate insert
- CSRF and field sanitation

