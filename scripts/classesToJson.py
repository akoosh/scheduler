import sys, csv, json, string

def main(arg1=None,arg2=None):
  if arg1 == None:
    arg1 = sys.argv[1]

  if arg2 == None:
    arg2 = sys.argv[2]

  with open(arg1) as csvfile:
    classes = {}
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')

    with open(arg2) as supFile:
      sup = generateSupplementaryData( supFile )

    for row in reader:
      strip_whitespace(row)
      classObject = classToDict( row, sup )

      classes[str(classObject["subject_with_number"])+str(classObject["section"])] = classObject

    # Process the class dependencies
    classKeys = classes.keys()
    for k in classKeys:
      if k in classes:
        for dep in classes[k]["auto"]:
          if dep == "":
            continue
          depClass = str(classes[k]["subject_with_number"]) + str(dep)
          if depClass in classes:
            for meeting in classes[depClass]["meetings"]:
              classes[k]["meetings"].append( meeting )
              classes[depClass]["searchable"] = False
            del classes[depClass]
          else:
            print "Attempted to find dep class: %s, for: %s but could not find the class! This means that there is an error with the auto-enroll information in the provided data." % ( depClass, k )
        del classes[k]["auto"]


    f = open('classes.json', 'w')
    f.write( json.dumps( classes.values() ) )

def get( row, values, default='' ):

  result = default

  if not isinstance( values, list ):
    values = [values]

  for value in values:
    if value in row:
      result = row[value]
      break

  if result == default:
    errorKey = str( values ) + str( default )
    if errorKey not in get.errors:
      get.errors[errorKey] = True
      print "Attempted to get value(s) '%s' but was not found." % str(values)
    
  return result

get.errors = {}


def classToDict(row,sup):

  classObject = {}
  classObject['department'] = get( row, ['Descr'] )
  classObject['subject'] = get( row, ['Subject'] ) 
  classObject['section'] = get( row, ['Section'] ) 
  classObject['subject_number'] = int("".join( [ x for x in get( row, ['Catalog'] ) .lower() if x not in string.ascii_lowercase  ] ))
  classObject['subject_with_number'] = get( row, ['Subject'] )  + get( row, ['Catalog'] ) 
  classObject['units'] = get( row, ['Min Units'] ) 
  classObject['ge_code'] = get( row, ['Designation'] ) 
  classObject['number'] = get( row, ['Class Nbr'] ) 
  classObject["searchable"] = True
  classObject['meetings'] = [] 


  supId = get( row, ['Subject'] ) + get( row, ['Catalog'] ) 
  if not supId in sup:
    sup[supId] = {}
    print "Attempted to find supplementary data for %s but was not available" % supId

  classObject['description'] = get( sup[supId], ['description'], "No description available" )
  classObject['title'] = get( sup[supId], ['title'], classObject['subject_with_number'] )



  meeting = {}
  meeting['class_number'] = get( row, ['Class Nbr'] ) 
  meeting['professor'] =  get( row, ['Last'] )
  meeting['type'] = get( row, ['Component'] ) 
  meeting['location'] =  get( row, ['Facil ID'] ) 
  meeting['capacity'] =  get( row, ['Capacity'] ) 
  meeting['totalEnrolled'] =  get( row, ['Tot Enrl'] ) 
  meeting['availableSeats'] =  get( row, ['Avail Seats'] ) 
  meeting['start_time'] = get( row, ['START TIME'] ) 
  meeting['end_time'] = get( row, ['END TIME'] ) 
  meeting['days'] = get( row, ['Pat'] ) 

  classObject["meetings"].append( meeting )

  # Store the other sections that need to be included with this course
  classObject['auto'] = [ get( row, "Auto Enrol" ), get( row, "Auto Enr 2" ) ] 
  

  return classObject

def strip_whitespace(row):
  for k in row.keys():
    row[k] = row[k].strip()

def generateSupplementaryData( supFile ):
  result = {}
  reader = csv.DictReader( supFile, delimiter=',', quotechar='"')
  for row in reader:
    strip_whitespace( row )
    result[row['Subject']+row['Catalog']] = { "title" : get( row, ['Long Title']), "description" : get( row, ['Course Descr'] ) }
    
  return result


if __name__ == "__main__":
  main()
