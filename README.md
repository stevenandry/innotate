# nanasskripsi
## Team Skripsi Nanas dan Team Skripsi Online Selama Covid-19

What you need to get this App working :
- **XAMPP MySQL Database**
- **Flask Python Framework**

You need to set the **'root@localhost'** default account at MySQL with a password. This Application accepts **'root'** as the username and password.

### And then, you need to create a database called 'flask' with these tables and columns (tablename [column datatype,] ) :
- canvas [canvaswidth text, canvasheight text]
- current_cursor [Annotator text, Position text]
- label [labelname text, colorvalue text]
- coordinates [Image text, Label text, StartX text, StartY text, EndX text, EndY text, Tool text, Color text, Annotator text]

Preferably, you can change all the datatypes into the ones you prefer (just make sure it can accept both numbers and words with a good limit)

### After setting the database, you need to configure directory config of your PC in order for the app to load and delete images. Here's how to do it :
- Open 'main.py' in the project directory
- Search for the keyword 'DIRECTORY_CONFIG'
- Change the directory using your application directory to static/images folder. For example : (D:/Your/Path/to/project/static/images) this directory will be used for loading and deleting images from the application

### After all the fuss, you can now start running the App. If you are not using an IDE (Visual Studio Code and so on) you need to run the App manually from command prompt. Here's how to do it :
- Open command prompt on the project directory
- Type in **"Venv\Scripts\Activate"**
- After Virtual Environment has been succesfully executed, type in **"set FLASK_APP=__init__.py"** where __init__.py is our main application file
- Then just type in **"flask run"** and application will be opened at port 5000 @ localhost.

Once you are able to see the login screen, you can start by creating a new user or logging in with the a test account that was pre-created :
Email     : **testuser@gmail.com**
Password  : **Test**

An Admin account was also precreated using this credentials :
Email     : **admin@admin.com**
Password  : **admin**

Log-in using the admin account and visit the **Settings** page to start loading images, create labels, and configure canvas size. Then you can start annotating through the **Annotate** page.
