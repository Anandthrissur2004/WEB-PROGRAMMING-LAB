#Flask initialization
from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)

# Create database and table
def create_table():
    conn = sqlite3.connect("contacts.db")

    conn.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Handle form submission
@app.route("/submit", methods=["POST"])
def submit():

    name = request.form["name"]
    email = request.form["email"]
    message = request.form["message"]

    # Store data in database
    conn = sqlite3.connect("contacts.db")

    conn.execute(
        "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
        (name, email, message)
    )

    conn.commit()
    conn.close()

    return render_template("success.html", name=name)


if __name__ == "__main__":
    create_table()
    app.run(debug=True)
