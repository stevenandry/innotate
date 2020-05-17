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

After setting the database, you can start running the App by creating a new user or logging in with the a test account that was pre-created :
Email     : testuser@gmail.com
Password  : Test

Once you logged in, you're good to go! you can start adding images to static/images folder and start annotating.
