import os
import logging

from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd
from cs50 import SQL

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filemode='w'  # 'w' to overwrite, 'a' to append
)

logger = logging.getLogger(__name__)


# Configure application
app = (__name__)

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")


# define some constants so we don't use magic strings
CREDIT = "CREDIT"
DEBIT = "DEBIT"
CASH = "CASH"
STOCKS = "STOCKS"


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""

    try:
        user_info = db.execute(
            "SELECT cash FROM users WHERE id =?", session["user_id"])
        assets = db.execute("""SELECT id, symbol, shares
                            FROM assets
                            WHERE user_id = ?
                            GROUP BY symbol
                            ORDER BY symbol ASC""",
                            session["user_id"])
        for asset in assets:
            ticker_info = lookup(asset["symbol"])
            price = ticker_info["price"]
            value = price * asset["shares"]
            asset["current_price"] = price
            asset["value"] = value
            logger.info(f"asset: {asset}")

    except Exception as e:
        logger.error(e)
        return apology("Server error", 500)

    return render_template("index.html", assets=assets, cash=user_info[0]["cash"])


@ app.route("/buy", methods=["GET", "POST"])
@ login_required
def buy():
    """Buy shares of stock"""

    if request.method == "POST":
        # validate input
        shares_input = request.form.get("shares")

        if not request.form.get("symbol"):
            return apology("Please enter the symbol you wish to purchase", 400)

        if not shares_input:
            return apology("Please enter the number of shares you wish to purchase", 400)

        try:
            shares = int(shares_input)
            if shares <= 0:
                return apology("Number of shares must be positive", 400)
        except ValueError:
            return apology("Number of shares must be a valid integer", 400)

        # get the symbol
        symbol = request.form.get("symbol")

        try:
            stock = lookup(symbol)

            if not stock:
                return apology("Ticker symbol not found", 400)

            # get the user's cash left
            user_id = session["user_id"]
            cash_response = db.execute("SELECT cash from users where id = ?",
                                       user_id)

            price = stock["price"]
            cost = stock["price"] * shares
            if cost > cash_response[0]["cash"]:
                return apology("Not enough cash, buddy.", 400)

            # record the transactions
            # credit the stocks
            db.execute("""INSERT INTO transactions (user_id, transaction_type, account, qty, price, symbol)
                       VALUES (?, ?, ?, ?, ?, ?)""", user_id, CREDIT, STOCKS, shares, price, symbol)
            # debit the cash
            db.execute("""INSERT INTO transactions (user_id, transaction_type, account, qty, price)
                       VALUES (?, ?, ?, ?, ?)""", user_id, DEBIT, CASH, shares, price)

            # update the user's stock portfolio
            # do they already have a row for this asset?
            existing_row = db.execute(
                "SELECT id from assets WHERE user_id = ? AND symbol = ?", user_id, symbol)

            if existing_row:
                # update shares
                db.execute(
                    "UPDATE assets SET shares = shares + ? WHERE id = ?", shares, existing_row[0]["id"])
            else:
                # add shares
                db.execute(
                    "INSERT INTO assets (user_id, symbol, shares) VALUES(?, ?, ?)", user_id, symbol, shares)

            # deduct the cash from the user
            db.execute(
                "UPDATE users SET cash = cash - ? WHERE id = ?", cost, user_id)

            return redirect("/")

        except Exception as e:
            logger.error(e)
            return apology("An error occurred", 500)

    # GET request
    return render_template("buy.html")


@ app.route("/history")
@ login_required
def history():
    """Show history of transactions"""

    user_id = session["user_id"]
    transactions = db.execute(
        "SELECT * FROM transactions WHERE user_id = ? AND account = ?", user_id, STOCKS)

    return render_template("history.html", transactions=transactions)


@ app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get(
                "username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@ app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@ app.route("/quote", methods=["GET", "POST"])
@ login_required
def quote():
    """Get stock quote."""
    if request.method == "POST":
        if not request.form.get("symbol"):
            return apology("must provide a ticker symbol", 400)

        quote_data = lookup(request.form.get("symbol"))

        if not quote_data:
            return apology("symbol not found", 400)

        return render_template("quoted.html", quote_data=quote_data)

    return render_template("quote.html")


@ app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 400)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 400)

        # Ensure password confirm was submitted
        elif not request.form.get("confirmation"):
            return apology("must provide password confirmation")

        # Ensure passwords match
        elif not request.form.get("password") == request.form.get("confirmation"):
            return apology("passwords do not match")

        hashed_pass = generate_password_hash(request.form.get("password"))

        try:
            # Insert new user into database
            new_user_id = db.execute(
                "INSERT INTO users (username, hash) VALUES (?, ?)",
                request.form.get("username"),
                hashed_pass,
            )

            if not new_user_id:
                return apology("Unable to create user", 400)

            # record the initial 10k cash transaction
            transaction = db.execute("""INSERT INTO transactions (user_id, transaction_type, account, qty, price)
                                     VALUES (?, ?, ?, ?, ?)""", new_user_id, CREDIT, CASH, 1, 10000)

            if not transaction:
                return apology("Unable to record transaction", 400)

        except ValueError as e:
            logger.error(e)
            return apology("username already taken", 400)

        except Exception as e:
            print(f"Error: {e}")
            return apology("Error creating new account", 500)

        # Remember which user has logged in
        session["user_id"] = new_user_id

        # Redirect user to home page
        return redirect("/")

    return render_template("register.html")


@ app.route("/sell", methods=["GET", "POST"])
@ login_required
def sell():
    """Sell shares of stock"""
    if request.method == "POST":
        # validate input
        shares_input = request.form.get("shares")

        if not request.form.get("symbol"):
            return apology("Please enter the symbol you wish to sell", 400)

        if not shares_input:
            return apology("Please enter the number of shares you wish to sell", 400)

        try:
            shares = int(shares_input)
            if shares <= 0:
                return apology("Number of shares must be positive", 400)
        except ValueError:
            return apology("Number of shares must be a valid integer", 400)

        try:
            # get the symbol
            symbol = request.form.get("symbol").upper()
            stock = lookup(symbol)
            user_id = session["user_id"]

            if not stock:
                return apology("Ticker symbol not found", 400)

            # do they already own this asset?
            existing_row = db.execute(
                "SELECT shares, id FROM assets WHERE user_id = ? AND symbol = ?", user_id, symbol)

            if not existing_row:
                return apology("Asset not in portfolio", 400)

            existing_shares = existing_row[0]["shares"]
            existing_id = existing_row[0]["id"]

            if existing_shares < shares:
                return apology("You do not have enough shares", 400)

            price = stock["price"]
            sell_value = stock["price"] * shares

            # record the transactions
            # debit the stocks
            db.execute("""INSERT INTO transactions (user_id, transaction_type, account, qty, price, symbol)
                       VALUES (?, ?, ?, ?, ?, ?)""", user_id, DEBIT, STOCKS, shares, price, symbol)
            # credit the cash
            db.execute("""INSERT INTO transactions (user_id, transaction_type, account, qty, price)
                       VALUES (?, ?, ?, ?, ?)""", user_id, CREDIT, CASH, shares, price)

            # update the user's stock portfolio

            if existing_shares > shares:
                # decrement the shares
                db.execute(
                    "UPDATE assets SET shares = shares - ? WHERE id = ?", shares, existing_id)
            else:
                # delete shares row
                db.execute(
                    "DELETE from assets where id = ?", existing_id)

            # Increment the cash to the user
            db.execute(
                "UPDATE users SET cash = cash + ? WHERE id = ?", sell_value, user_id)

            return redirect("/")

        except Exception as e:
            logger.error(e)
            return apology("An error occurred", 500)
    else:
        assets = db.execute("""SELECT id, symbol, shares
                                FROM assets
                                WHERE user_id = ?
                                GROUP BY symbol
                                ORDER BY symbol ASC""",
                            session["user_id"])
    return render_template("sell.html", assets=assets)


# run in debug mode so it auto refreshes when we change app.py
if __name__ == "__main__":
    app.debug = True
    app.run()
