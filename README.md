# Innotate Data Annotation Tool

What you need to get this App working :
- **XAMPP MySQL Database**
- **Flask Python Framework**

Download XAMPP. Then, run Apache and PHPMYADMIN. Then enter MySQL Database 
You need to set the **'root@localhost'** default account at MySQL with a password. This Application accepts **'root'** as the username and password.

### Create a database called "flask". You don't need to create any table because the App will do it for you

### After setting the database, you need to configure directory config of your PC in order for the app to load and delete images. Here's how to do it :
- Open **'main.py'** in the project directory
- Search for the keyword **'DIRECTORY_CONFIG'**
- Change the directory using your application directory to **static/images** folder. For example : (D:/Your/Path/to/project/static/images) this directory will be used for loading and deleting images from the application

### After all the fuss, you can now start running the App. If you are not using an IDE (Visual Studio Code and so on) you need to run the App manually from command prompt. Here's how to do it :
- Open command prompt on the project directory
- Type in **"Venv\Scripts\Activate"**
- After Virtual Environment has been succesfully executed, type in **"set FLASK_APP=underscoreunderscoreinitunderscoreunderscore.py"** change the underscore to an actual underscore (because i can't write it in here)
- Then just type in **"flask run"** and application will be opened at port 5000 @ localhost.

![Home Page](https://i.ibb.co/HTJT6Kt/2020-06-02-16-52-57-Movies-TV.png)

Once you are able to see the home page, you can start by creating a new user or logging in with the pre-created admin account :
- Email     : **admin@admin.com**
- Password  : **admin**

Log-in using the admin account and visit the **Settings** page to start loading images, create labels, and configure canvas size. Then you can start annotating through the **Annotate** page.

This is what you will see when you succesfully logged in as an **Admin** :

![Home_Page_Logged_In](https://i.ibb.co/3vx8pRx/2020-06-02-16-57-15.png)

You can start annotating once you loaded images into the application :

![Annotate Page](https://i.ibb.co/fQxGZWV/2020-06-02-16-59-28-Movies-TV.png)

The app is very user friendly and easy to use, and im sure you'll know what to do next. **Have Fun!**
