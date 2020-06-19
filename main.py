import os
import sys
import json
import sqlite3
import shutil
import io
import csv
from flask import Blueprint, render_template, request, redirect, url_for, flash, Response
from flask import Flask, redirect, url_for, request, send_file
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from .models import User
from flask_login import login_required, current_user
from datetime import datetime
import MySQLdb

main = Blueprint('main', __name__)

# DIRECTORY CONFIGURATIONS
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
DIRECTORY_CONFIG = "D:/Files (Work & Projects)/Campus/Flask/project/static/images"
DOWNLOAD_PATH = "static/images/"
dbuser = "flaskadmin"
dbpass = "D3f@u1tP@ssw0rd729"

@main.route('/')
def index():
	#Creating Admin when app first runs
	adminemail = "admin@admin.com"
	adminname = "admin"
	adminpassword = "admin"
	username = User.query.filter_by(name=adminname).first()    
	if username : #if admin has been created, it will not be created
		pass
	else :
		new_user = User(email=adminemail, name=adminname, password=generate_password_hash(adminpassword, method='sha256'))
		db.session.add(new_user)
		db.session.commit()    
	return render_template('index.html')

@main.route('/profile')
@login_required
def profile():
	return render_template('profile.html', name=current_user.name, email=current_user.email)

@main.route('/update/password', methods=['GET','POST'])
@login_required
def update_password():
	if request.method == 'POST' :
		password = request.form.get('password')
		rptpassword = request.form.get('rptpassword')
		if password:
			if password == rptpassword:
				try:
					sqliteConnection = sqlite3.connect('db.sqlite')
					cursor = sqliteConnection.cursor()
					# print(password)
					hashpassword=generate_password_hash(password, method='sha256')
					data = (hashpassword,current_user.name)

					sql_update_query = """Update user set password = ? where name = ?"""
					cursor.execute(sql_update_query,data)
					sqliteConnection.commit()
					# print("Record Updated successfully ")
					cursor.close()
					
				except sqlite3.Error as error:
					print("Failed to update password! ", error)
					flash("Failed to update password! Please try again later.")
					return redirect(url_for('main.profile'))

				finally:
					if (sqliteConnection):
						sqliteConnection.close()
						# print("The SQLite connection is closed")
						flash('Succesfully changed password!')
						return redirect(url_for('main.profile'))
			else:
				flash('Password is not the same! Please try again.')
				return redirect(url_for('main.profile'))

		else:
			flash("Password cant be empty!")
			return redirect(url_for('main.profile'))

@main.route('/home')
@login_required
def index_loggedin():
	images = os.listdir('static/images')
	imagelist = [file for file in images]
	conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
	c = conn.cursor()
	c.execute("CREATE TABLE IF NOT EXISTS Coordinates(Image text,Label text, StartX text, StartY text, EndX text, EndY text, Tool text, Color text, Annotator text)")
	c.execute('SELECT * FROM coordinates')
	dbdata = c.fetchall()

	image_list = []
	annotatorlist = []
	for col in dbdata:
		image_name = col[0]
		annotator = col[8]
		image_list.append(image_name)
		annotatorlist.append(annotator)
	return render_template('index.html', name=current_user.name, imagelist=imagelist, image_name=image_list, annotator=annotatorlist)

@main.route('/deletelabel', methods=['GET','POST'])
@login_required
def delete_label() :
	if request.method == 'POST':
		colorvalue = request.form['delete_labelcolor']
		conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
		c = conn.cursor()
		c.execute('DELETE FROM label WHERE colorvalue = %s ', [colorvalue])
		conn.commit()
		conn.close()
		return 'success~'

@main.route('/deletelabelall', methods=['GET','POST'])
@login_required
def delete_label_all() :
	if request.method == 'POST':
		conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
		c = conn.cursor()
		c.execute('TRUNCATE TABLE label')
		conn.commit()
		conn.close()
		return 'success~'

@main.route('/savelabel', methods=['GET','POST'])
@login_required
def save_label():
	if request.method == 'POST':
		labelname = request.form['save_labelname']
		colorvalue = request.form['save_colorvalue']
		conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
		c = conn.cursor()
		c.execute("CREATE TABLE IF NOT EXISTS label(labelname varchar(100),colorvalue varchar(100))")
		c.execute('INSERT INTO label(labelname, colorvalue) VALUES (%s,%s)', (labelname,colorvalue))
		conn.commit()
		conn.close()
		return 'success~'

@main.route('/resizeconfig', methods=['GET','POST'])
@login_required
def resize_config():
	if request.method == 'GET':
		return render_template('canvas-size.html')

	if request.method == 'POST':
		resizewidth=request.form.get('canvas-width')
		resizeheight=request.form.get('canvas-height')
		if (resizewidth == '' or resizeheight == '' ) :
			flash("Please fill all the forms!")
			return redirect(url_for('main.resize_config'))

		conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
		c = conn.cursor()
		c.execute("CREATE TABLE IF NOT EXISTS canvas(canvaswidth varchar(100),canvasheight varchar(100))")
		c.execute('TRUNCATE TABLE canvas')
		c.execute('INSERT INTO canvas(canvaswidth, canvasheight) VALUES (%s,%s)', (resizewidth,resizeheight))
		conn.commit()
		conn.close()
		return redirect(url_for('main.annotation', width = resizewidth, height = resizeheight))

@main.route('/resize')
@login_required
def resize():
	conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
	c = conn.cursor()
	c.execute("CREATE TABLE IF NOT EXISTS canvas(canvaswidth varchar(100),canvasheight varchar(100))")
	c.execute("SELECT * FROM canvas")
	dbdata = c.fetchall()
	if dbdata:
		for col in dbdata:
			resizewidth = col[0]
			resizeheight = col[1]
		return redirect(url_for('main.annotation', width = resizewidth, height = resizeheight))

	else :
		return redirect(url_for('main.resize_config'))

@main.route('/dbdelete', methods=['GET', 'POST'])
@login_required
def dbdelete():
	if request.method == 'POST':
		content = request.get_json()

		datalist = []
		for item in content:
			container = (item['image_name'],item['startx'],item['starty'])
			datalist.append(container)

		query = """ DELETE FROM coordinates WHERE Image = %s AND StartX = %s AND StartY = %s """
		conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
		c = conn.cursor()
		c.executemany(query,datalist)
		conn.commit()
		conn.close()
		return 'success'

@main.route('/updatecursor', methods=['GET', 'POST'])
@login_required
def updatecursor():
	if request.method == 'POST' :
		#cursor = request.get_data(as_text=True)
		#print(request.is_json)
		content = request.get_json()
		for item in content:
			container = (item['annotator'],item['cursor'])
			annotator = item['annotator']
		#print(container)

		conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
		c = conn.cursor()
		#c.execute("TRUNCATE TABLE current_cursor")
		c.execute("DELETE FROM current_cursor WHERE Annotator = %s",[annotator])
		c.execute('INSERT INTO current_cursor(Annotator,Position) VALUES (%s,%s)', container)
		conn.commit()
		conn.close()
	return 'success'

@main.route('/result', methods=['GET', 'POST'])
@login_required
def result():
	if request.method == 'GET':
		images = os.listdir('static/images')
		imagelist = [file for file in images]
		conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
		c = conn.cursor()
		c.execute("CREATE TABLE IF NOT EXISTS Coordinates(Image text,Label text, StartX text, StartY text, EndX text, EndY text, Tool text, Color text, Annotator text)")
		c.execute("SELECT * FROM coordinates")
		coordinatesdata = c.fetchall()
		imagenamelist = []
		imagelabellist = []
		startxlist = []
		startylist = []
		endxlist = []
		endylist = []
		toollist = []
		colorlist = []
		annotatorlist = []
		for col in coordinatesdata :
			imagename = col[0]
			imagelabel = col[1]
			startx = col[2]
			starty = col[3]
			endx = col[4]
			endy = col[5]
			tool = col[6]
			color = col[7]
			annotator = col[8]
	
			imagenamelist.append(imagename)
			imagelabellist.append(imagelabel)
			startxlist.append(startx)
			startylist.append(starty)
			endxlist.append(endx)
			endylist.append(endy)
			toollist.append(tool)
			colorlist.append(color)
			annotatorlist.append(annotator)

		return render_template('result.html', name=current_user.name, imagelist = imagelist, imagenamelist = imagenamelist, 
		imagelabellist = imagelabellist, startxlist=startxlist, startylist=startylist, endxlist=endxlist, endylist=endylist, 
		toollist=toollist, colorlist=colorlist, annotatorlist=annotatorlist)

	# if request.method == 'POST':

@main.route('/annotation', methods=['GET', 'POST'])
@login_required
def annotation():
	if request.method == 'GET':
		name = current_user.name
		images = os.listdir('static/images')
		imagelist = [file for file in images]
		conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
		c = conn.cursor()
		c.execute("CREATE TABLE IF NOT EXISTS current_cursor(Annotator text, Position text)")
		c.execute("CREATE TABLE IF NOT EXISTS Coordinates(Image text,Label text, StartX text, StartY text, EndX text, EndY text, Tool text, Color text, Annotator text)")
		c.execute("CREATE TABLE IF NOT EXISTS label(labelname varchar(100),colorvalue varchar(100))")
		c.execute("SELECT * FROM label")
		labeldata = c.fetchall()
		
		c.execute("SELECT Position FROM current_cursor WHERE Annotator = %s",[name])
		cursordata = c.fetchall()
		cursor = ""
		if cursordata:
			for col in cursordata :
				cursor = col[0]
		else:
			cursor = 1
		c.execute("SELECT * FROM coordinates")
		coordinatesdata = c.fetchall()
		imagenamelist = []
		imagelabellist = []
		startxlist = []
		startylist = []
		endxlist = []
		endylist = []
		toollist = []
		colorlist = []
		annotatorlist = []
		for col in coordinatesdata :
			imagename = col[0]
			imagelabel = col[1]
			startx = col[2]
			starty = col[3]
			endx = col[4]
			endy = col[5]
			tool = col[6]
			color = col[7]
			annotator = col[8]

			imagenamelist.append(imagename)
			imagelabellist.append(imagelabel)
			startxlist.append(startx)
			startylist.append(starty)
			endxlist.append(endx)
			endylist.append(endy)
			toollist.append(tool)
			colorlist.append(color)
			annotatorlist.append(annotator)
		return render_template('paint.html', name=current_user.name, cnvswidth=request.args.get('width'), cnvsheight=request.args.get('height'), imagelist=imagelist, labeldata=labeldata, 
		imagenamelist = imagenamelist, imagelabellist = imagelabellist, startxlist=startxlist, startylist=startylist, endxlist=endxlist, endylist=endylist, toollist=toollist, colorlist=colorlist, annotatorlist=annotatorlist, cursor=cursor)
	
	if request.method == 'POST':
		content = request.get_json()
		datalist = []
		for item in content:
			container = (item['image_name'],item['label'],item['startx'],item['starty'],item['endx'],item['endy'],item['tool'],item['color']
				,item['annotator'])
			datalist.append(container)
		query = """ INSERT INTO Coordinates(Image, Label, StartX, StartY, EndX, EndY, Tool, Color, Annotator) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) """
		conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
		c = conn.cursor()
		c.executemany(query,datalist)
		conn.commit()
		conn.close()
		return 'success~'

@main.route('/settings')
@login_required
def settings():
	if request.method == 'GET':
		if current_user.name == 'admin' :
			images = os.listdir('static/images')
			imagelist = [file for file in images]
			conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
			c = conn.cursor()
			c.execute("CREATE TABLE IF NOT EXISTS label(labelname varchar(100),colorvalue varchar(100))")
			c.execute("CREATE TABLE IF NOT EXISTS canvas(canvaswidth varchar(100),canvasheight varchar(100))")
			c.execute("CREATE TABLE IF NOT EXISTS Coordinates(Image text,Label text, StartX text, StartY text, EndX text, EndY text, Tool text, Color text, Annotator text)")

			c.execute("SELECT * FROM label")
			labeldata = c.fetchall()
			c.execute("SELECT * FROM canvas")
			canvasdata = c.fetchall()
			c.execute("SELECT Annotator FROM coordinates")
			annotatorlist = c.fetchall()

			return render_template('settings.html',labeldata=labeldata,canvasdata=canvasdata,imagelist=imagelist,annotatorlist=annotatorlist)
		else :
			return 'You do not have permission to access this page!'
		
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@main.route('/loadimage', methods=['GET', 'POST'])
@login_required
def loadimage():
	if request.method == 'POST':
		if 'files[]' not in request.files:
			flash('No file part')
			return redirect(url_for('main.settings'))
		files = request.files.getlist('files[]')
		counter = 0
		for file in files:
			if file and allowed_file(file.filename):
				filename = secure_filename(file.filename)
				file.save(os.path.join(DIRECTORY_CONFIG, filename))
				counter += 1
		flash(str(counter) + ' File(s) successfully uploaded.')
		return redirect(url_for('main.settings'))
		
@main.route('/deleteimage', methods=['GET', 'POST'])
@login_required
def deleteimage():
	if request.method == 'POST':
		files = request.form.getlist('deleteImageSelection')
		if files:
			counter = 0
			for file in files :
				os.remove(os.path.join(DIRECTORY_CONFIG, file))
				counter += 1
			flash(str(counter)+ ' File(s) successfully removed.')
			return redirect(url_for('main.settings'))
		else:
			flash("Nothing has been selected! no files were deleted.")
			return redirect(url_for('main.settings'))

@main.route('/download/annotations/csv')
@login_required
def download_result():
	conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
	c = conn.cursor()
	
	c.execute("SELECT * FROM coordinates")
	result = c.fetchall()

	output = io.StringIO()
	writer = csv.writer(output)
		
	line = ['Image Name, Label, StartX, StartY, EndX, EndY, Tool, Color, Annotator']
	writer.writerow(line)

	for row in result:
		# line = [str(row['Image']) + ',' + row['Label'] + ',' + row['StartX'] + ',' + row['StartY'] + ',' + row['EndX'] + ',' + row['EndY']
		# + ',' + row['Tool'] + ',' + row['Color'] + ',' + row['Annotator']]
		line = [str(row[0]) + ',' + row[1] + ',' + row[2] + ',' + row[3] + ',' + row[4] + ',' + row[5]
		+ ',' + row[6] + ',' + row[7] + ',' + row[8]]
		writer.writerow(line)
	todaydate = datetime.date(datetime.now())
	convertstrdate = todaydate.strftime("%Y-%b-%d")
	output.seek(0)
	c.close() 
	conn.close()
	#return 's'
	return Response(output, mimetype="text/csv", headers={"Content-Disposition":"attachment;filename=data_result_"+convertstrdate+".csv"})
	
@main.route('/download/image',methods=['GET', 'POST'])
@login_required
def download_image():
	if request.method == 'POST':
		filename = request.form.get('downloadImage')
		print(filename)
		path = DOWNLOAD_PATH+filename
		return send_file(path, as_attachment=True)

@main.route('/delete/alldata')
@login_required
def delete_alldata():
	if current_user.name == 'admin' :
		conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
		c = conn.cursor()
		c.execute("TRUNCATE TABLE coordinates")
		conn.commit()
		conn.close()
		flash("Deletion Succesfull.")
		return redirect(url_for('main.settings'))
	else:
		return 'You do not have permission to access this page!'

@main.route('/delete/userdata', methods=['GET', 'POST'])
@login_required
def delete_userdata():
	if request.method == 'POST' :
		if current_user.name == 'admin' :
			content = request.get_json()
			datalist = []
			counter = 0
			for item in content:
				container = (item['name'])
				datalist.append(container)
				counter += 1
			conn = MySQLdb.connect(host="localhost",user = dbuser,password = dbpass,db = "flask")
			c = conn.cursor()
			query = """ DELETE FROM coordinates WHERE Annotator = %s """
			for item in datalist:
				c.execute(query,[item])
			conn.commit()
			conn.close()
			flash("Succesfully deleted "+str(counter)+" user data ")
			return 'success'
		else:
			return 'You do not have permission to access this page!'