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
- After Virtual Environment has been succesfully executed, type in **"set FLASK_APP=\_\_init\_\_.py"**
- Then just type in **"flask run"** and application will be opened at port 5000 @ localhost.

![Home Page](https://i.ibb.co/HTJT6Kt/2020-06-02-16-52-57-Movies-TV.png)

Once you are able to see the home page, you can start by creating a new user or logging in with the pre-created admin account :
- Email     : **admin@admin.com**
- Password  : **admin**

Log-in using the admin account and visit the **Settings** page to start loading images, create labels, and configure canvas size. Then you can start annotating through the **Annotate** page.

This is what you will see when you succesfully logged in as an **Admin** :

![Home_Page_Logged_In](https://i.ibb.co/3vx8pRx/2020-06-02-16-57-15.png)

You can see that i had a few annotations already from the statistics in the **Home Page**. You can then start/continue annotating once you loaded images into the application :

![Annotate Page](https://i.ibb.co/fQxGZWV/2020-06-02-16-59-28-Movies-TV.png)

The app is very user friendly and easy to use, and im sure you'll know what to do next. **Have Fun!**

## Deployment

To deploy this app, we have provided files needed in order to deploy both in **Windows** and **Linux**.

### Windows
- Open a command prompt in the project directory
- Type in **"nssm install Innotate"**
- Click Yes in any administrator prompt
- Then, on application path, browse and head to the directory of **run.bat** . this file is provided in the project directory.
- Click install service

And you're done! to run the service, go ahead to services and start **Innotate** service. the application will be available in **localhost:8080**

### Linux
- First, type in **chmod +x runlinux.sh** in the project folder to make the script executable.
- Type in **"cd /etc/systemd/system"** to go to the services directory.
- Copy **innotate.service** file onto the directory.
- Edit **innotate.service** file, change the directory of **ExecStart** into directory of **runlinux.sh** file which is provided inside project folder.
- Finally, type in **systemctl start innotate** to start the application!
- Check service status by typing **systemctl status innotate**. the service is supposed to be active and running. Try to visit **127.0.0.1:8080** to see the application.
- If above does not work, try to type in **systemctl enable innotate.service** and **systemctl start innotate.service**. Then check the status and visit the link above to open the application.
