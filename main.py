import os
import sys
import json
import sqlite3
from flask import Blueprint, render_template, request, redirect, url_for, flash, Response
from flask import Flask, redirect, url_for, request, send_file
from . import db
from flask_login import login_required, current_user



main = Blueprint('main', __name__)

@main.route('/')
def index():
	return render_template('index.html')

@main.route('/home')
def index_loggedin():
	images = os.listdir('static/images')
	imagelist = ['images/' + file for file in images]
	return render_template('index.html', name=current_user.name, imagelist=imagelist)

@main.route('/imagez')
def imagez():
	images = os.listdir('static/images')
	imagelist = ['images/' + file for file in images]
	# images = os.listdir(os.path.join(main.static_url_path, "images"))
	return render_template('loadimage.html', imagelist=imagelist)#,images=images)

@main.route('/resize')
@login_required
def resize():
	return render_template('canvas-size.html')

@main.route('/resize', methods=['POST'])
@login_required
def resize_post():
	resizewidth=request.form.get('canvas-width')
	resizeheight=request.form.get('canvas-height')
	if (resizewidth == '' or resizeheight == '' ) :
		flash("Please fill all the forms!")
		return redirect(url_for('main.resize'))
	# return render_template('paint.html', width=resizewidth, height=resizeheight)
	return redirect(url_for('main.profile', width = resizewidth, height = resizeheight))

@main.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
	if request.method == 'GET':
		return render_template('paint.html', cnvswidth=request.args.get('width'), cnvsheight=request.args.get('height') )
	
	if request.method == 'POST':
		label = request.form['save_label']
		startx = request.form['save_startx']
		starty = request.form['save_starty']
		endx = request.form['save_endx']
		endy = request.form['save_endy']
		tool = request.form['save_tool']
		color = request.form['save_color']

		dbdata = (label,startx,starty,endx,endy,tool,color)
		
		con = sqlite3.connect("Annotations.db")
		cur=con.cursor()
		cur.execute("CREATE TABLE IF NOT EXISTS Coordinates(Label text, StartX text, StartY text, EndX text, EndY text, Tool text, Color text)")
		cur.execute("INSERT INTO Coordinates VALUES(?, ?, ?, ?, ?, ?, ?)", dbdata)
		con.commit()
		con.close()
		
	
# POST Method using SQLITE DB with 3 data values
	# if request.method == 'POST':
	# 	filename=request.form['save_fname']
	# 	data=request.form['save_cdata']
	# 	image = request.form['save_image']
	
	# 	dbdata=(filename, data, image)

	# 	con = sqlite3.connect("Drawings2.db")
	# 	cur=con.cursor()
	# 	cur.execute("CREATE TABLE IF NOT EXISTS files(name text, data text, canvas_image text)")
	# 	cur.execute("INSERT INTO files VALUES(?, ?, ?)", dbdata)
	# 	con.commit()
	# 	con.close()
		
	
@main.route('/save', methods=['GET', 'POST'])
def save():
	con = sqlite3.connect("Drawings.db")
	cur = con.cursor()
	cur.execute("SELECT name, data, canvas_image from files")
	files = cur.fetchall()
	con.close()
	return render_template("save.html", files = files )
	
@main.route('/search', methods=['GET', 'POST'])
def search():
	if request.method == 'GET':
		return render_template("search.html")
	if request.method == 'POST':
		filename = request.form['fname']
		con = sqlite3.connect("Drawings.db")
		cur = con.cursor()
		cur.execute("select name, data, canvas_image from files")
		files = cur.fetchall()
		con.close()
		return render_template("search.html", files=files, filename=filename)

# @main.route('/tagger')
# def tagger():
#     if (main.config["HEAD"] == len(app.config["FILES"])):
#         return redirect(url_for('bye'))
#     directory = app.config['IMAGES']
#     image = app.config["FILES"][app.config["HEAD"]]
#     labels = app.config["LABELS"]
#     not_end = not(app.config["HEAD"] == len(app.config["FILES"]) - 1)
#     print(not_end)
#     return render_template('tagger.html', not_end=not_end, directory=directory, image=image, labels=labels, head=app.config["HEAD"] + 1, len=len(app.config["FILES"]))

# @main.route('/next')
# def next():
#     image = app.config["FILES"][app.config["HEAD"]]
#     app.config["HEAD"] = app.config["HEAD"] + 1
#     with open(app.config["OUT"],'a') as f:
#         for label in app.config["LABELS"]:
#             f.write(image + "," +
#             label["id"] + "," +
#             label["name"] + "," +
#             str(round(float(label["xMin"]))) + "," +
#             str(round(float(label["xMax"]))) + "," +
#             str(round(float(label["yMin"]))) + "," +
#             str(round(float(label["yMax"]))) + "\n")
#     app.config["LABELS"] = []
#     return redirect(url_for('tagger'))

# @main.route("/bye")
# def bye():
#     return send_file("taf.gif", mimetype='image/gif')

# @main.route('/add/<id>')
# def add(id):
#     xMin = request.args.get("xMin")
#     xMax = request.args.get("xMax")
#     yMin = request.args.get("yMin")
#     yMax = request.args.get("yMax")
#     app.config["LABELS"].append({"id":id, "name":"", "xMin":xMin, "xMax":xMax, "yMin":yMin, "yMax":yMax})
#     return redirect(url_for('tagger'))

# @main.route('/remove/<id>')
# def remove(id):
#     index = int(id) - 1
#     del app.config["LABELS"][index]
#     for label in app.config["LABELS"][index:]:
#         label["id"] = str(int(label["id"]) - 1)
#     return redirect(url_for('tagger'))

# @main.route('/label/<id>')
# def label(id):
#     name = request.args.get("name")
#     app.config["LABELS"][int(id) - 1]["name"] = name
#     return redirect(url_for('tagger'))

# @app.route('/prev')
# def prev():
#     app.config["HEAD"] = app.config["HEAD"] - 1
#     return redirect(url_for('tagger'))

# @main.route('/image/<f>')
# def images(f):
#     images = app.config['IMAGES']
#     return send_file(images + f)

# @main.route('/profile')
# @login_required
# def profile():
#     return render_template('marker.html', name=current_user.name)

# @main.route('/save', methods=['GET', 'POST'])
# def save():
# 	conn = psycopg2.connect(database="tutorial", user = "postgres", password = "Password1234", host = "localhost" , port = "5432")
# 	cur = conn.cursor()
# 	cur.execute("SELECT id, name, data, canvas_image from files")
# 	files = cur.fetchall()
# 	conn.close()
# 	return render_template("save.html", files = files )

	# POST Method using SQLITE DB with 2 data values
	# if request.method == 'POST':
	# 	filename=request.form['save_fname']
	# 	data=request.form['save_cdata']
		
	# 	dbdata=(filename, data)

	# 	con = sqlite3.connect("Image.db")
	# 	cur=con.cursor()
	# 	cur.execute("CREATE TABLE IF NOT EXISTS Image(imgname text, imgdata string)")
	# 	cur.execute("INSERT INTO files2 VALUES(?, ?)", dbdata)
	# 	con.commit()
	# 	con.close()
	# 	resp = Response("saved")
	# 	return resp

	# POST Method Using POSTGRESQL with 3 values
	# if request.method == 'POST':
	#     filename = request.form['save_fname']
	#     data = request.form['save_cdata']
	#     # canvas_image = request.form['save_image']
	#     conn = psycopg2.connect(database="tutorial", user = "postgres", password = "Password1234", host = "localhost" , port = "5432")
	#     cur = conn.cursor()
	#     cur.execute("CREATE TABLE IF NOT EXISTS files(name text, imgdata string)")
	#     cur.execute("INSERT INTO files (name, data) VALUES (%s, %s)", [filename, data])
	#     # cur.execute("INSERT INTO files (name, data, canvas_image) VALUES (%s, %s, %s)", [filename, data, canvas_image])
	#     conn.commit()
	#     conn.close()
	#     return redirect(url_for('save'))