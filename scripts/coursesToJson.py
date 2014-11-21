import csv
import sys
import json

def main():
    course_model= CourseModel()

    with open(sys.argv[1]) as csvfile:

        reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')

        for row in reader:
            course = Course.to_dict(row)
            course_model.add(course)

    f = open('courses.json', 'w')
    f.write( json.dumps(course_model.courses.values()) )

class CourseModel(object):

    def __init__(self):
        self.cur_class = None
        self.courses = {}
        self.counter = 0

    def add(self, course):

        self.counter += 1
        this_class = self.get_class_from_course(course)

        if self.has_course(course):
            if self.is_section_of_cur_class(this_class):
                self.update_cur_class(this_class)
            else:
                self.add_class_to_course(course)
        else:
            self.add_new_course(course)

    def add_section_to_cur_class(self, section):
        self.cur_class['sections'].append(section)

    def update_matching_section_info(self, section):
        for cur_section in self.cur_class['sections']:
            if cur_section['type'] == section['type']:
                self.merge_section_into_cur_section(section, cur_section)
                return
        print "No matching sections"

    def merge_section_into_cur_section(self, section, cur_section):
        cur_section['meetings'].append( section['meetings'][0] )

    def times_are_different(self, time1, time2):
        return time1['start_time'] != time2['start_time'] or time1['end_time'] != time2['end_time'] or time1['days'] != time2['days']

    def update_cur_class(self, this_class):
        section = self.get_section_from_class(this_class)
        if this_class['number'] == self.cur_class['number']:
            self.update_matching_section_info(section)
        else:
            self.add_section_to_cur_class(section)

    def get_class_from_course(self, course):
        return course['classes'][0]

    def get_section_from_class(self, this_class):
        return this_class['sections'][0]

    def is_section_of_cur_class(self, this_class):
        section_type = self.get_section_from_class(this_class)['type']
        # potential bug: if one section has multiple meetings, second meeting might fail both conditions
        return self.cur_class['number'] == this_class['number'] or all([section_type != section['type'] for section in self.cur_class['sections']])

    def has_course(self, course):
        return course['subjectWithNumber'] in self.courses

    def add_new_course(self, course):
        subjectWithNumber = course['subjectWithNumber']
        self.courses[subjectWithNumber] = course
        self.cur_class = self.get_class_from_course(course)

    def add_class_to_course(self, course):
        this_class = self.get_class_from_course(course)
        subjectWithNumber = course['subjectWithNumber']
        self.courses[subjectWithNumber]['classes'].append( this_class)
        self.cur_class = this_class

class Course(object):
    
    @staticmethod
    def to_dict(row):

        Course.strip_whitespace(row)

        course = {}
        course['title'] = row['Descr']
        course['subject'] = row['Sbjt']
        course['subjectWithNumber'] = row['Sbjt'] + row['Cat#']
        course['units'] = row['SUV']
        course['geCode'] = row['Component']
        course['classes'] = [] 

        this_class = {}
        this_class['number'] = row['Cls#']
        this_class['sections'] = []

        this_section = {}
        this_section['type'] = row['AsnType']
        this_section['meetings'] = []

        this_section_meeting = {}
        this_section_meeting['professor'] = row['Last']
        this_section_meeting['location'] = row['Facil ID']
        this_section_meeting['startTime'] = row['START TIME']
        this_section_meeting['endTime'] = row['END TIME']
        this_section_meeting['days'] = row['Pat']

        this_section['meetings'].append(this_section_meeting)
        this_class['sections'].append(this_section)
        course['classes'].append(this_class)

        return course

    @staticmethod
    def strip_whitespace(row):
        for k in row.keys():
            row[k] = row[k].strip()

main()
