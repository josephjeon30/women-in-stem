import sqlite3
import csv
DB_FILE = "file.db"

db = sqlite3.connect(DB_FILE, check_same_thread=False)
c = db.cursor() 
c.executescript("""
    create TABLE if NOT EXISTS user(u_id int primary key, username varchar(20), password varchar(30));
    create TABLE if NOT EXISTS notepads(u_id int primary key, user_id int, name text);
    create TABLE if NOT EXISTS test_notepad(u_id int primary key, user_id int, type text, data text, xcord float, ycord float)
""")
c.close()

current = " "

#note: names of tables must start with a letter, so the table of each notepad will be named after the the id with "a" in the front 

def get_username(id):
    c = db.cursor()
    c.execute("select username FROM user WHERE u_id = ?", (id,))
    result = c.fetchone()
    c.close()
    if(result == None):
        return None
    else:
        return result[0]

def get_password(id):
    c = db.cursor()
    c.execute("select password FROM user WHERE u_id = ?", (id, ))
    result = c.fetchone()
    c.close()
    if(result == None):
        return None
    else: 
        return result[0]

def register_new_user(username, password): 
    c = db.cursor()
    c.execute("select exists(select 1 from user where username=?)", (username,))
    if (c.fetchone()[0] == 1):
        return -1
    c.execute("SELECT MAX(u_id) FROM user")
    max_id = c.fetchone()
    if (max_id[0] != None):
        new_id = max_id[0] + 1
    else:
        new_id = 0
    c.execute("insert into user values(? ,?, ?)", (new_id, username, password,))
    db.commit()
    c.close()
    return new_id

def account_match(username, password):
    c = db.cursor()
    c.execute('select u_id from user where (username = ? AND password = ?)', (str(username), str(password),))
    u_id = c.fetchone()
    c.close()
    if(u_id != None):
        return u_id[0]
    else:
        return None
