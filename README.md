ssu_scheduler
=============

App URL:

http://ssuscheduler.meteor.com/


Installation(ubuntu)
============

Installation is pretty simple

  - Get nodejs:
  ```
    sudo apt-get update
    sudo apt-get install nodejs
  ```

  - Get meteor:
  ```
    curl https://install.meteor.com/ | sh
  ```
    This will install meteor and the meteor package manager on your machine.

  - Get Mongodb
  ```
    sudo apt-get install mongodb
  ```

  - Download the scheduler app
    ```
    git clone https://github.com/Alfwich/ssu_scheduler.git
    ```

  - Import the data
  First you need to have the meteor application to access the mongo database. So from the root of the project repo run the following command
  ```
    meteor
  ```

  This will run the meteor package manager ( similar to doing a apt-get update ) then spin up the scheduler application.
  The app should build and start without any problem; however, there will be no course data yet. Run the following commands to insert the data from the scripts folder. Make sure you have meteor running to allow access to the mongo database.
  ```
  python updateDatabase.py
  ```
Installation(osx)
============
  Installation is similar to ubuntu

  - Get Brew:
    https://github.com/Homebrew/homebrew
    Package manager for osx.

  - Get nodejs:
  ```
    brew install node
  ```

  - Get meteor:
  ```
    curl https://install.meteor.com/ | sh
  ```
    This will install meteor and the meteor package manager on your machine.

  - Get Mongodb
  ```
    brew install mongodb
  ```

  - Importing the data
    This is the same for osx and ubuntu. Use the script updateDatabase.py within the scripts folder.


Installation(windows)
============
Seems like the windows version of Meteor is getting off its feet:

https://github.com/meteor/meteor/wiki/Preview-of-Meteor-on-Windows
