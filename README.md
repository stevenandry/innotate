# nanasskripsi
Team Skripsi Nanas dan Team Skripsi Online Selama Covid-19

What you need to get this App working :
- XAMPP MySQL Database
- Flask Python Framework

You need to set the 'root@localhost' default account at MySQL with a password. This Application accepts 'root' as the username and password.

And then, you need to create a database called 'flask' with these tables and columns (tablename [column datatype,] ) :
- canvas [canvaswidth text, canvasheight text]
- current_cursor [Position text]
- label [labelname text, colorvalue text]
- coordinates [Image text, Label text, StartX text, StartY text, EndX text, EndY text, Tool text, Color text, Annotator text]

Preferably, you can change all the datatypes into the ones you prefer (just make sure it can accept both numbers and words with a good limit)

After setting the database, you can start running the App. If you are not using an IDE (Visual Studio Code and so on) you need to run the App manually from command prompt. Here's how to do it :
- Open command prompt on the project directory
- Type in "Venv\Scripts\Activate"
- After Virtual Environment has been succesfully executed, type in "set FLASK_APP=__init__.py" where __init__.py is our main application file
- Then just type in "flask run" and application will be opened at port 5000 @ localhost.

Once you are able to see the login screen, you can start by creating a new user or logging in with the a test account that was pre-created :
Email     : testuser@gmail.com
Password  : Test

Once you logged in, you're good to go! you can start adding images to static/images folder and start annotating.
