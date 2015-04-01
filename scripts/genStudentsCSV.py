def main():
  with open( "students.csv", "w" ) as f:
    f.write( "\"StudentId\",\"HasAccess\"\n" );
    for i in range( 1, 1000 ):
      f.write( "\"%s\",\"%s\"\n" % ( str(i).zfill(9), "1" ) );

if __name__ == "__main__":
  main()
