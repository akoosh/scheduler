def main():
  with open( "students.csv", "w" ) as f:
    f.write( "\"StudentId\",\"HasAccess\"\n" );
    for i in range( 1, 10**4 ):
      f.write( "\"%s\",\"%s\"\n" % ( str(i), "1" ) );

if __name__ == "__main__":
  main()
