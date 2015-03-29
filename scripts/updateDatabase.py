#!/usr/bin/python

import csv, sys, json, string, hashlib, os, subprocess, time
from coursesToJson import main as cTJ
from studentsToJson import main as sTJ
from coursesToClassesJson import main as cTCJ

def main():
  with open( "config.json", "r" ) as config:
    cfg = json.load( config )
    writeTime = str( int(time.time()) )

    if "CourseData" in cfg and "SupCourseData" in cfg:
      if os.path.isfile( cfg["CourseData"] ) and os.path.isfile( cfg["SupCourseData"] ):
        print "Generating course data..."
        cTJ( cfg["CourseData"], cfg["SupCourseData"] )
        print "Done."

        print "Generating class data..."
        cTCJ()
        print "Done."

        print "Importing course data into mongo..."
        os.system( "mongoimport -h %s:%s --drop --db %s --collection Courses --type json --jsonArray --file courses.json && mv courses.json bkup/courses.%s.json" % ( cfg["MeteorAddress"], cfg["MeteorPort"], cfg["MeteorDB"], writeTime ) )
        print "Done."

        print "Importing class data into mongo..."
        os.system( "mongoimport -h %s:%s --drop --db %s --collection Classes --type json --jsonArray --file classes.json && mv classes.json bkup/classes.%s.json" % ( cfg["MeteorAddress"], cfg["MeteorPort"], cfg["MeteorDB"], writeTime ) )
        print "Done."


    if "StudentData" in cfg:
      if os.path.isfile( cfg["StudentData"] ):
        print "Generating student data..."
        sTJ( cfg["StudentData"] )
        print "Done."

        print "Importing student data into mongo..."
        os.system( "mongoimport -h %s:%s --drop --db %s --collection Students --type json --jsonArray --file students.json && mv students.json bkup/students.%s.json" % ( cfg["MeteorAddress"], cfg["MeteorPort"], cfg["MeteorDB"], writeTime ) )
        print "Done."
    

if __name__ == "__main__":
  main()
