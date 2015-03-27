#!/usr/bin/python

import csv, sys, json, string, hashlib, os, subprocess, time
from coursesToJson import main as cTJ
from studentsToJson import main as sTJ
# mongoimport -h localhost:3001 --drop --db meteor --collection UserData --type json --jsonArray --file userData.json

def main():
  with open( "config.json", "r" ) as config:
    cfg = json.load( config )

    if "CourseData" in cfg and "SupCourseData" in cfg:
      if os.path.isfile( cfg["CourseData"] ) and os.path.isfile( cfg["SupCourseData"] ):
        print "Generating course data..."
        cTJ( cfg["CourseData"], cfg["SupCourseData"] )
        print "Done."

        print "Importing student data into mongo..."
        os.system( "mongoimport -h %s:%s --drop --db %s --collection Courses --type json --jsonArray --file courses.json && mv courses.json bkup/courses.%s.json" % ( cfg["MeteorAddress"], cfg["MeteorPort"], cfg["MeteorDB"], str(time.time()) ) )
        print "Done."
        # Import


    if "StudentData" in cfg:
      if os.path.isfile( cfg["StudentData"] ):
        print "Generating student data..."
        sTJ( cfg["StudentData"] )
        print "Done."

        print "Importing student data into mongo..."
        os.system( "mongoimport -h %s:%s --drop --db %s --collection Students --type json --jsonArray --file students.json && mv students.json bkup/students.%s.json" % ( cfg["MeteorAddress"], cfg["MeteorPort"], cfg["MeteorDB"], int(time.time()) ) )
        print "Done."
        # Import
    
  # Load the config file
  # Generate the json files if available
  # Insert the new json files into the database
  # Destroy the generated json files ( place in a backup folder? )

if __name__ == "__main__":
  main()
