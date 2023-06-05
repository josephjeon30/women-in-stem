from flask import Flask, session, render_template, request, redirect, url_for
from db import *
import sqlite3

app = Flask(__name__)
app.secret_key = "temp"

@app.route("/login", methods=["GET", "POST"])
def login():
    if ( request.method == "GET" ):
        return render_template("login.html")
    Input0 = request.form.get("username")
    Input1 = request.form.get("password")
    session_id = account_match(Input0, Input1)
    if ( session_id != None ):
        session["ID"] = session_id
        return redirect(url_for("home_page"))
    return render_template("login.html", status="Username and passwords do not match.")

@app.route("/logout", methods=["GET", "POST"])
def logout():
    session.pop("ID",None)
    return redirect(url_for("login", status="Please login"))

@app.route("/register", methods=["GET", "POST"])
def register_page():
    if( request.method == "GET"):
        return render_template("register.html")
    Input0 = request.form.get("username")
    Input1 = request.form.get("password")
    Input2 = request.form.get("confirmation")
    if Input1 == Input2:
        Session_id = register_new_user(Input0, Input1)
        if( Session_id != -1 ):
            session["ID"] = Session_id
            return redirect(url_for("home_page"))
        return render_template("register.html", status="Login info is in use.")
    else:
        return render_template("register.html", status="Passwords do not match.")

@app.route("/", methods=["GET", "POST"])
def home_page():
    if(session.get("ID", None) == None):
        return redirect(url_for("login"))
    elif (get_username(session.get("ID")) == None):
        return redirect(url_for("login"))
    else:
        session_user = F"{get_username(session['ID'])}"
    return render_template("home_page.html", user=session_user)

@app.route("/user", methods=["GET","POST"])
def user():
    if(session.get("ID", None) == None):
        return redirect(url_for("login"))
    session_user = F"{get_username(session['ID'])}"

    if(request.method == "POST"):
        selected_notepad = request.form.get("notepad")
        print(selected_notepad)
        return redirect(url_for("notepad", selected=selected_notepad))

    return render_template("user.html",user=session_user)

@app.route("/notepad", methods=["GET","POST"])
def notepad():
    if(session.get("ID", None) == None):
        return redirect(url_for("login"))
    session_user = F"{get_username(session['ID'])}"
    
    #select which notepad
    selected_notepad=request.args.get('selected')
    return render_template("notepad.html",user=session_user, selected=selected_notepad)

if __name__ == "__main__":
    app.debug = True
    app.run()