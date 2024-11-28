import os
from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session


# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///birthdays.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/", methods=["GET", "POST"])
def index():

    if request.method == "POST":
        # TODO: Add the user's entry into the database
        form_data = request.form
        name = form_data.get("name")
        month = int(form_data.get("month"))
        day = int(form_data.get("day"))
        if (day not in range(1, 32)) or (month not in range(1, 13)):
            return redirect("/?error=Invalid month or date")

        if len(name) < 1:
            return redirect("/?error=Name too short. Please use at least 1 character", error="Name too short. Please use at least 1 character")

        db.execute("INSERT INTO birthdays (name, month, day) VALUES (?, ?, ?)", name, month, day)
        return redirect("/")

    else:

        # TODO: Display the entries in the database on index.html
        birthdays = db.execute("SELECT * FROM birthdays")
        return render_template("index.html", birthdays=birthdays)


# run in debug mode so it auto refreshes when we change app.py
if __name__ == "__main__":
    app.debug = True
    app.run()