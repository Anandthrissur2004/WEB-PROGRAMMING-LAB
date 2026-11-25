#Flask Initialization and Database Connection
#User Table Creation
from flask import Flask, render_template, request, redirect, session, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Secret key for session management
app.secret_key = "my_secret_key"


# Database connection and table creation
def create_table():
    conn = sqlite3.connect("users.db")

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# User registration
@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"].strip()
        email = request.form["email"].strip().lower()
        password = request.form["password"]

        # Input validation
        if not username or not email or not password:
            flash("All fields are required!")
            return redirect("/register")

        if "@" not in email or "." not in email:
            flash("Enter a valid email address!")
            return redirect("/register")

        if len(password) < 8:
            flash("Password must contain at least 8 characters!")
            return redirect("/register")

        conn = sqlite3.connect("users.db")

        # Check whether email already exists
        existing_user = conn.execute(
            "SELECT * FROM users WHERE email = ?", (email,)
        ).fetchone()

        if existing_user:
            conn.close()
            flash("Email already registered!")
            return redirect("/register")

        # Hash password
        hashed_password = generate_password_hash(password)

        # Insert user into database
        conn.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password)
        )

        conn.commit()
        conn.close()

        flash("Registration successful! Please login.")
        return redirect("/login")

    return render_template("register.html")


# User login
@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"].strip().lower()
        password = request.form["password"]

        conn = sqlite3.connect("users.db")

        user = conn.execute(
            "SELECT * FROM users WHERE email = ?", (email,)
        ).fetchone()

        conn.close()

        if user and check_password_hash(user[3], password):

            session.clear()
            session["user_id"] = user[0]
            session["username"] = user[1]

            return redirect("/dashboard")

        else:
            flash("Invalid email or password!")
            return redirect("/login")

    return render_template("login.html")


# Dashboard
@app.route("/dashboard")
def dashboard():

    if "user_id" not in session:
        return redirect("/login")

    return render_template(
        "dashboard.html",
        username=session["username"]
    )


# User logout
@app.route("/logout", methods=["POST"])
def logout():

    session.clear()

    flash("You have logged out successfully!")

    return redirect("/login")


if __name__ == "__main__":
    create_table()
    app.run(debug=True)
