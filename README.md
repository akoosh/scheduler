ssu_scheduler
=============


Installation(ubuntu)
============

Installation is pretty simple

  1. Get nodejs:
  ```
    sudo apt-get update
    sudo apt-get install nodejs
  ```

  2. Get meteor:
  ```
    curl https://install.meteor.com/ | sh
  ```
    This will install meteor and the meteor package manager on your machine.

  3. Get Mongodb
  ```
    sudo apt-get install mongodb
  ```

  4. Download the scheduler app
    ```
    git clone https://github.com/Alfwich/ssu_scheduler.git
    ```

  5. Insert classes into the mongodb database
  First you need to have the meteor application to access the mongo database. So from the root of the project repo run the following command
  ```
    meteor
  ```

  This will run the meteor package manager ( similar to doing a apt-get update ) then spin up the scheduler application.
  The app should build and start without any problem; however, there will be no course data yet. Run the following commands to insert the data
  ```
  cd scripts
  mongoimport -h localhost:3001 --db meteor --collection Courses --type json --jsonArray --file courses.json
  ```

Update Database
===============

To update DB with new data:

Get rid of old data:
meteor
meteor mongo
db.Courses.remove()

Import new data from json:
mongoimport -h localhost:3002 --db meteor --collection Courses --type json --jsonArray --file courses.json

Currently Implemented
=====================

##CSV Parser for Backend Data: 
Zack has created a python script for taking .csv files and converting them into JSON.
This JSON file is then imported into the mongo database using the command above.

##Backend: 
Currently we are using mongo through a helper objects to access the course information. 

```
CoursesModel = new Meteor.Collection( "Courses" );
```

Which is used in the following files:

+ /collections/course.js
+ /collections/helpers/courses.js

##Page Loader:
The page loader is functionally complete. This contains the developer sidebar.

###Related Files:
+ /html/pageLoader.html
+ /client/pageLoader.js

##Search Template:
The search template page is functionally complete.

###Related Files:
+ /html/courseSearch.htlp
+ /html/main.js

##Search Functionality:
The current state of searching allows searching from the following fields:
+ Professors
+ Title
+ GE Code
+ Subject Number
+ Subject
+ Units

There is still work to be done with documenting the search functionality.

###Related Files:
+ /client/collections/courses.js

##Schedule Template:
The schedule template is functional. 

###Related Files:
/html/schedules.html
/client/schedulePage.js

##Schedule Generation:
Schedules are generated currently using a canvas object and jCanvas. There is a good deal of work here to make the schedules more readable and useful.

###Related Files:
+ /client/ScheduleManager.js
+ /client/ScheduleRenderer.js 
