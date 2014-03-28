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
            if cur_section['type'] is section['type']:
                self.merge_section_into_cur_section(section, cur_section)
                return
        print "No matching sections"

    def merge_section_into_cur_section(self, section, cur_section):

        professor = section['professors'][0]
        location = section['locations'][0]
        time = section['times'][0]

        if professor not in cur_section['professors']: cur_section['professors'].append( professor )
        if location not in cur_section['locations']: cur_section['locations'].append( location )
        if all([self.times_are_different(time, cur_time) for cur_time in cur_section['times']]):
            cur_section['times'].append(time)

    def times_are_different(self, time1, time2):
        return time1['start_time'] != time2['start_time'] or time1['end_time'] != time2['end_time'] or time1['days'] != time2['days']

    def update_cur_class(self, this_class):
        section = self.get_section_from_class(this_class)
        if this_class['number'] is self.cur_class['number']:
            self.update_matching_section_info(section)
        else:
            self.add_section_to_cur_class(section)

    def get_class_from_course(self, course):
        return course['classes'][0]

    def get_section_from_class(self, this_class):
        return this_class['sections'][0]

    def is_section_of_cur_class(self, this_class):
        section_type = self.get_section_from_class(this_class)['type']
        return self.cur_class['number'] == this_class['number'] or all([section_type is not section['type'] for section in self.cur_class['sections']])

    def has_course(self, course):
        return course['subject_with_number'] in self.courses

    def add_new_course(self, course):
        subject_with_number = course['subject_with_number']
        self.courses[subject_with_number] = course
        self.cur_class = self.get_class_from_course(course)

    def add_class_to_course(course):
        this_class = self.get_class_from_course(course)
        subject_with_number = course['subject_with_number']
        self.courses[subject_with_number]['classes'].append( this_class)
        self.cur_class = this_class

class Course(object):
    
    @staticmethod
    def to_dict(row):

        Course.strip_whitespace(row)

        course = {}
        course['title'] = row['Descr']
        course['subject'] = row['Sbjt']
        course['subject_with_number'] = row['Sbjt'] + row['Cat#']
        course['units'] = row['SUV']
        course['ge_code'] = row['Designation']
        course['classes'] = [] 

        this_class = {}
        this_class['number'] = row['Cls#']
        this_class['sections'] = []

        this_section = {}
        this_section['professors'] = [ row['Last'] ]
        this_section['type'] = row['Component']
        this_section['locations'] = [ row['Facil ID'] ]
        this_section['times'] = []

        this_time = {}
        this_time['start_time'] = row['START TIME']
        this_time['end_time'] = row['END TIME']
        this_time['days'] = row['Pat']

        this_section['times'].append(this_time)
        this_class['sections'].append(this_section)
        course['classes'].append(this_class)

        return course

    @staticmethod
    def strip_whitespace(row):
        for k in row.keys():
            row[k] = row[k].strip()

main()
