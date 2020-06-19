from flask import Flask
#from flask_mysqldb import MySQL
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask import request
from waitress import serve

# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()

def create_app():
	app = Flask(__name__)
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	app.config['SECRET_KEY'] = '9OLWxND4o83j4K4iuopO'
	app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

	# app.config['MYSQL_HOST'] = 'localhost:81'
	# app.config['MYSQL_USER'] = 'root'
	# app.config['MYSQL_PASSWORD'] = 'root'
	# app.config['MYSQL_DB'] = 'Flask'

	db.init_app(app)
	

	login_manager = LoginManager()
	login_manager.login_view = 'auth.login'
	login_manager.init_app(app)

	from .models import User

	@login_manager.user_loader
	def load_user(user_id):
	# since the user_id is just the primary key of our user table, use it in the query for the user
		return User.query.get(int(user_id))
		
	# blueprint for auth routes in our app
	from .auth import auth as auth_blueprint
	app.register_blueprint(auth_blueprint)

	# blueprint for non-auth parts of app
	from .main import main as main_blueprint
	app.register_blueprint(main_blueprint)

	#return app
	return serve(app, host='0.0.0.0', port=8080)

# def mysqlconnection():
#     conn = MySQLdb.connect(host="localhost:81",user = "root",password = "root",db = "flask")
#     c = conn.cursor()
#     return c, conn