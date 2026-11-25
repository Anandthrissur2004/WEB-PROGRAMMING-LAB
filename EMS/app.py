#Flask initialization and database connection
from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

# Database connection
def get_db():
    conn = sqlite3.connect("employees.db")
    conn.row_factory = sqlite3.Row
    return conn


# Employee table creation
def create_table():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            department TEXT NOT NULL,
            salary REAL NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# Add and display employee functionality
#Search by employee name or ID
@app.route("/")
def index():
    search = request.args.get("search", "").strip()

    conn = get_db()

    employees = conn.execute("""
        SELECT * FROM employees
        WHERE CAST(id AS TEXT) LIKE ?
        OR name LIKE ?
        ORDER BY id
    """, (f"%{search}%", f"%{search}%")).fetchall()

    conn.close()

    return render_template(
        "index.html",
        employees=employees,
        search=search
    )


# Add employee page
@app.route("/add", methods=["GET", "POST"])
def add():
    if request.method == "POST":

        name = request.form["name"]
        email = request.form["email"]
        department = request.form["department"]
        salary = request.form["salary"]

        conn = get_db()

        conn.execute("""
            INSERT INTO employees
            (name, email, department, salary)
            VALUES (?, ?, ?, ?)
        """, (name, email, department, salary))

        conn.commit()
        conn.close()

        return redirect(url_for("index"))

    return render_template("add.html")


# Update and delete employee functionality
@app.route("/edit/<int:id>", methods=["GET", "POST"])
def edit(id):

    conn = get_db()

    if request.method == "POST":

        name = request.form["name"]
        email = request.form["email"]
        department = request.form["department"]
        salary = request.form["salary"]

        conn.execute("""
            UPDATE employees
            SET name=?, email=?, department=?, salary=?
            WHERE id=?
        """, (name, email, department, salary, id))

        conn.commit()
        conn.close()

        return redirect(url_for("index"))

    employee = conn.execute(
        "SELECT * FROM employees WHERE id=?", (id,)
    ).fetchone()

    conn.close()

    if employee is None:
        return "Employee not found", 404

    return render_template("edit.html", employee=employee)


# Delete employee
@app.route("/delete/<int:id>")
def delete(id):

    conn = get_db()

    conn.execute(
        "DELETE FROM employees WHERE id=?", (id,)
    )

    conn.commit()
    conn.close()

    return redirect(url_for("index"))


if __name__ == "__main__":
    create_table()
    app.run(debug=True)
