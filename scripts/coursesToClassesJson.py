import sys, json

def mergeCourseAndClass( course, c ):
  interestedFields = [ "subject", "ge_code", "description", "title", "units", "subject_with_number", "department", "subject_number" ]
  for field in interestedFields:
    if field in course:
      c[field] = course[field]

def main():
  with open( "courses.json" ) as jsonData:
    courses = json.load( jsonData )
    cSet = set()
    result = []
    for course in courses:
      for c in course["classes"]:
        if not c["number"] in cSet:
          mergeCourseAndClass( course, c )
          cSet.add( c["number"] )
          c["id"] = c["number"]
          result.append( c )
        else:
          print( "DUPLICATE class with number: " + str(c) )

    f = open('classes.json', 'w')
    f.write( json.dumps( result ) )
        

if __name__ == "__main__":
  main()
