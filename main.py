import os
import sys
import json
import sqlite3
from flask import Blueprint, render_template, request, redirect, url_for, flash, Response
from flask import Flask, redirect, url_for, request, send_file
from . import db
from flask_login import login_required, current_user
import MySQLdb
# from flask_mysqldb import MySQL > ini gabisa pake connection string langsung, harus lewat app config maka nya
# gajadi pake
# import MySQLdb > gajadi dibuat disini, krn ternyata bs ambil function dr file lain.
# and as suggested in on of sites, its better to create the connection in another file krn file utama nya
# lama kelamaan akan numpuk dengan function calls and code yg lain dan bakal susah untuk dimanage.

# import MySQLdb > jadi nya dibuat disini deh krn gw gtau cr pake connection ny dr file lain gimana jd ribet
# from __init__ import mysqlconnection


main = Blueprint('main', __name__)
# mysql = MySQL(main) > kalo pake flask_mysqldb import MySQL

@main.route('/')
def index():
	return render_template('index.html')

@main.route('/home')
@login_required
def index_loggedin():
	images = os.listdir('static/images')
	imagelist = [file for file in images]
	conn = MySQLdb.connect(host="localhost",user = "root",password = "root",db = "flask")
	c = conn.cursor()
	c.execute('SELECT * FROM coordinates')
	dbdata = c.fetchall()

	image_list = []
	annotatorlist = []
	for col in dbdata:
		image_name = col[0]
		annotator = col[8]
		image_list.append(image_name)
		annotatorlist.append(annotator)
		# print(image_list + annotatorlist)
		# label = col[1]
		# startx = col[2]
		# starty = col[3]
		# endx = col[4]
		# endy = col[5]
		# tool = col[6]
		# color = col[7]
	return render_template('index.html', name=current_user.name, imagelist=imagelist, image_name=image_list, annotator=annotatorlist)

@main.route('/imagez')
def imagez():
	images = os.listdir('static/images')
	imagelist = ['images/' + file for file in images]
	# images = os.listdir(os.path.join(main.static_url_path, "images"))
	return render_template('loadimage.html', imagelist=imagelist)#,images=images)

@main.route('/deletelabel', methods=['GET','POST'])
def delete_label() :
	if request.method == 'POST':
		colorvalue = request.form['delete_labelcolor']
		conn = MySQLdb.connect(host="localhost",user = "root",password = "root",db = "flask")
		c = conn.cursor()
		c.execute('DELETE FROM label WHERE colorvalue = %s ', [colorvalue])
		conn.commit()
		conn.close()
		return 'success~'

@main.route('/deletelabelall', methods=['GET','POST'])
def delete_label_all() :
	if request.method == 'POST':
		conn = MySQLdb.connect(host="localhost",user = "root",password = "root",db = "flask")
		c = conn.cursor()
		c.execute('TRUNCATE TABLE label')
		conn.commit()
		conn.close()
		return 'success~'

@main.route('/savelabel', methods=['GET','POST'])
def save_label():
	if request.method == 'POST':
		labelname = request.form['save_labelname']
		colorvalue = request.form['save_colorvalue']
		conn = MySQLdb.connect(host="localhost",user = "root",password = "root",db = "flask")
		c = conn.cursor()
		c.execute("CREATE TABLE IF NOT EXISTS label(labelname varchar(10),colorvalue varchar(10))")
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

		conn = MySQLdb.connect(host="localhost",user = "root",password = "root",db = "flask")
		c = conn.cursor()
		# c.execute("CREATE TABLE IF NOT EXISTS canvas(canvaswidth varchar,canvasheight varchar)")
		c.execute('TRUNCATE TABLE canvas')
		c.execute('INSERT INTO canvas(canvaswidth, canvasheight) VALUES (%s,%s)', (resizewidth,resizeheight))
		conn.commit()
		conn.close()
		# return render_template('paint.html', width=resizewidth, height=resizeheight)
		return redirect(url_for('main.profile', width = resizewidth, height = resizeheight))

@main.route('/resize')
@login_required
def resize():
	conn = MySQLdb.connect(host="localhost",user = "root",password = "root",db = "flask")
	c = conn.cursor()
	c.execute("SELECT * FROM canvas")
	# c.execute("SELECT canvaswidth FROM canvas")
	# c.execute("SELECT canvasheight FROM canvas")
	dbdata = c.fetchall()
	# dbcwidth = c.fetchall()
	# dbcheight = c.fetchall()
	if dbdata:
		for col in dbdata:
			resizewidth = col[0]
			resizeheight = col[1]
		return redirect(url_for('main.profile', width = resizewidth, height = resizeheight))
		# return render_template('paint.html', width = cnvswidth, height = cnvsheight)

	else :
		# return render_template('canvas-size.html')
		return redirect(url_for('main.resize_config'))


class SVGList:
	def __init__(self,image_name,label,startx,starty,endx,endy,tool,color,index):
		self.image_name = image_name
		self.label = label
		self.startx = startx
		self.starty = starty
		self.endx = endx
		self.endy = endy
		self.tool = tool
		self.color = color
		self.index = index
		# self.iterate = 0

	@classmethod
	def from_json(cls, json_string):
		json_dict = json.loads(json_string)
		return cls(**json_dict)

	def __repr__(self):
		return f'{self.image_name},{self.label},{self.startx},{self.starty},{self.endx},{self.endy},{self.tool},{self.color}'

	# def __iter__(self):
	# 	return self

	# def __next__(self):
	# 	# if self.iterate > self.high:
	# 	# 	raise StopIteration
	# 	# else:
	# 	# 	self.current += 1
	# 	# 	return self.current - 1
	# 	self.iterate+1
	# 	return self

# class SVGIterator:
# 	def __init__(self, svg):
# 		self._svg = svg

# 		self._index = 0

# 	def __next__(self):

class Counter:
    def __init__(self, low, high):
        self.current = low - 1
        self.high = high

    def __iter__(self):
        return self

    def __next__(self): # Python 2: def next(self)
        self.current += 1
        if self.current < self.high:
            return self.current
        raise StopIteration

# counterlist = []
# for c in Counter(3, 25):
#     counterlist.append(c)

@main.route('/dbdelete', methods=['GET', 'POST'])
@login_required
def dbdelete():
	if request.method == 'POST':
		del_imagename = request.form['del_imagename']
		del_startx = request.form['del_startx']
		del_starty = request.form['del_starty']
		conn = MySQLdb.connect(host="localhost",user = "root",password = "root",db = "flask")
		c = conn.cursor()
		deldbdata = (del_imagename,del_startx,del_starty)
		c.execute("DELETE FROM coordinates WHERE Image = %s AND StartX = %s AND StartY = %s",deldbdata)
		conn.commit()
		conn.close()
		return 'success'

@main.route('/updatecursor', methods=['GET', 'POST'])
@login_required
def updatecursor():
	if request.method == 'POST':
		cursor = request.form['update_cursor']
		conn = MySQLdb.connect(host="localhost",user = "root",password = "root",db = "flask")
		c = conn.cursor()
		c.execute("TRUNCATE TABLE current_cursor")
		c.execute('INSERT INTO current_cursor(Position) VALUES (%s)', [cursor])
		conn.commit()
		conn.close()
	return 'success'

@main.route('/result', methods=['GET', 'POST'])
@login_required
def result():
	if request.method == 'GET':
		images = os.listdir('static/images')
		imagelist = [file for file in images]
		conn = MySQLdb.connect(host="localhost",user = "root",password = "root",db = "flask")
		c = conn.cursor()
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
		annotateindexlist = []
		annotationidlist = []
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
			annotateindex =col[9]
			annotationid = col[10]
			imagenamelist.append(imagename)
			imagelabellist.append(imagelabel)
			startxlist.append(startx)
			startylist.append(starty)
			endxlist.append(endx)
			endylist.append(endy)
			toollist.append(tool)
			colorlist.append(color)
			annotatorlist.append(annotator)
			annotateindexlist.append(annotateindex)
			annotationidlist.append(annotationid)

		return render_template('result.html', name=current_user.name, imagelist = imagelist, imagenamelist = imagenamelist, 
		imagelabellist = imagelabellist, startxlist=startxlist, startylist=startylist, endxlist=endxlist, endylist=endylist, 
		toollist=toollist, colorlist=colorlist, annotatorlist=annotatorlist, annotateindexlist=annotateindexlist, annotationidlist = annotationidlist)

	# if request.method == 'POST':

@main.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
	if request.method == 'GET':
		# print(counterlist)
		images = os.listdir('static/images')
		imagelist = [file for file in images]
		conn = MySQLdb.connect(host="localhost",user = "root",password = "root",db = "flask")
		c = conn.cursor()
		c.execute("SELECT * FROM label")
		labeldata = c.fetchall()
		c.execute("SELECT Position FROM current_cursor")
		cursordata = c.fetchall()
		cursor = ""
		for col in cursordata :
			cursor = col[0]
		# c.execute("CREATE TABLE IF NOT EXISTS Coordinates(Image text,Label text, StartX text, StartY text, EndX text, EndY text, Tool text, Color text, Annotator text, Annotation_Index text, Annotation_ID text)")
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
		annotateindexlist = []
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
			annotateindex =col[9]

			imagenamelist.append(imagename)
			imagelabellist.append(imagelabel)
			startxlist.append(startx)
			startylist.append(starty)
			endxlist.append(endx)
			endylist.append(endy)
			toollist.append(tool)
			colorlist.append(color)
			annotatorlist.append(annotator)
			annotateindexlist.append(annotateindex)
		# print(imagenamelist,annotateindexlist)
		return render_template('paint.html', name=current_user.name, cnvswidth=request.args.get('width'), cnvsheight=request.args.get('height'), imagelist=imagelist, labeldata=labeldata, 
		imagenamelist = imagenamelist, imagelabellist = imagelabellist, startxlist=startxlist, startylist=startylist, endxlist=endxlist, endylist=endylist, toollist=toollist, colorlist=colorlist, annotatorlist=annotatorlist, annotateindexlist=annotateindexlist , cursor=cursor)
	
	if request.method == 'POST':
		imagename = request.form['save_imagename']
		label = request.form['save_label']
		startx = request.form['save_startx']
		starty = request.form['save_starty']
		endx = request.form['save_endx']
		endy = request.form['save_endy']
		tool = request.form['save_tool']
		color = request.form['save_color']
		annotator = request.form['save_annotator']
		annotateindex = request.form['save_annotateindex']
		annotationid = request.form['save_annotationid']
		#cursor = request.form['update_cursor']

		
		conn = MySQLdb.connect(host="localhost",user = "root",password = "root",db = "flask")
		c = conn.cursor()

		

		dbdata = (imagename,label,startx,starty,endx,endy,tool,color,annotator,annotateindex,annotationid)
		# query = "INSERT INTO Coordinates(Image, Label, StartX, StartY, EndX, EndY, Tool, Color, Annotator, Annotation_Index, Annotation_ID) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
		
		c.execute("CREATE TABLE IF NOT EXISTS Coordinates(Image text,Label text, StartX text, StartY text, EndX text, EndY text, Tool text, Color text, Annotator text, Annotation_Index text, Annotation_ID text)")
		# c.execute("CREATE TABLE IF NOT EXISTS Coordinates_dummy(Image text)")
		# c.execute('INSERT INTO Coordinates_dummy(Image) VALUES (%s)', data_list)
		# c.execute("TRUNCATE TABLE current_cursor")
		# c.execute('INSERT INTO current_cursor(Position) VALUES (%s)', [cursor])
		
		# c.execute('DELETE FROM Coordinates WHERE Image = "%s" and Annotator = "%s" ',imagename,annotator) > baru bs dipake kalo udah pake method post skali banyak
		c.execute('INSERT INTO Coordinates(Image, Label, StartX, StartY, EndX, EndY, Tool, Color, Annotator, Annotation_Index, Annotation_ID) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)', dbdata)
		# c.executemany(query, data_list)
		
		conn.commit()
		conn.close()
		return 'success~'

# POST Method DB SQLITE SEBELUM MIGRATE KE MYSQL
	# if request.method == 'POST':
	# 	imagename = request.form['save_imagename']
	# 	label = request.form['save_label']
	# 	startx = request.form['save_startx']
	# 	starty = request.form['save_starty']
	# 	endx = request.form['save_endx']
	# 	endy = request.form['save_endy']
	# 	tool = request.form['save_tool']
	# 	color = request.form['save_color']

	# 	dbdata = (imagename,label,startx,starty,endx,endy,tool,color)
		
	# 	con = sqlite3.connect("Annotations.db")
	# 	cur=con.cursor()
	# 	cur.execute("CREATE TABLE IF NOT EXISTS Coordinates(Image text,Label text, StartX text, StartY text, EndX text, EndY text, Tool text, Color text)")
	# 	cur.execute("INSERT INTO Coordinates VALUES(?, ?, ?, ?, ?, ?, ?, ?)", dbdata)
	# 	con.commit()
	# 	con.close()
		

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
		
	
# @main.route('/save', methods=['GET', 'POST'])
# def save():
	# con = sqlite3.connect("Drawings.db")
	# cur = con.cursor()
	# cur.execute("SELECT name, data, canvas_image from files")
	# files = cur.fetchall()
	# con.close()
	# return render_template("save.html", files = files )
	
# @main.route('/search', methods=['GET', 'POST'])
# def search():
	# if request.method == 'GET':
	# 	return render_template("search.html")
	# if request.method == 'POST':
	# 	filename = request.form['fname']
	# 	con = sqlite3.connect("Drawings.db")
	# 	cur = con.cursor()
	# 	cur.execute("select name, data, canvas_image from files")
	# 	files = cur.fetchall()
	# 	con.close()
	# 	return render_template("search.html", files=files, filename=filename)

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

# @main.route('/resize')
	# @login_required
	# def resize():
	# 	return render_template('canvas-size.html')

# JSON POST 
	# try:
		# 	c, conn = mysqlconnection()
		# 	return("Okay")
		# except Exception as e:
		# 	return(str(e))

		# c.execute("SELECT * FROM flask")
	# jsondot = request.form['dotsvgdata']
		# svgdot = SVGList.from_json(jsondot)
		
		# data_list = []
		
		# svgdot = json.loads(jsondot)

		# print(json.dumps(svgdot, indent=4))
		# loaded_json = json.loads(jsondot)
		# for x in loaded_json:
		# 	print("%s: %s" % (x, loaded_json))
		# user = SVGList.from_json(jsondot)
		# print(user.label)
		# print(user.startx)

		# for u in svgdot:
		# 	data_list.append(u)
		
		# print(svgdot[0])
		# print(data_list)
		# data_tuple = tuple(data_list)
		# print(data_tuple)

		# for u in svgdot:
		# 	data_list.append(SVGList(**u))
		# print(data_list)
		# import pdb;pdb.set_trace()
		# for data in data_list:
		# 	print(data_list[data])
		
		# for data in data_list:
		# 	test = data[0]
		# tuplee = (data_list[0])
		# print(tuplee)
		
		# return Response("test", status=200, mimetype= 'text/html')