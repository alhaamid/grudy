import csv

input_file_name = "courses.html"
output_file_name = "details.csv"

code_str = "Course code"
code_name = "Course name"

writer = csv.DictWriter(open(output_file_name, "w"), fieldnames=[code_str, code_name])
writer.writeheader()

with open(input_file_name, 'r') as reader:
    title_prefix = "<p class=\"courseblocktitle\"><strong>"
    title_suffix = "</strong></p>"
    desc_prefix = "<p class=\"courseblockdesc\">"

    course_code = None
    course_name = None

    all_file = reader.read()
    all_lines = all_file.split("\n")

    for index, line in enumerate(all_lines):
        title_start_index = line.find(title_prefix)
        title_end_index = line.find(title_suffix)
        desc_start_index = line.find(desc_prefix)

        if title_start_index != -1 and title_end_index != -1:
            subject = line[len(title_prefix): title_end_index]
            pieces = subject.split(".")
            course_code = pieces[0].strip()
            course_name = pieces[1].strip().replace("&amp;", "&")

            writer.writerow({code_str: course_code, code_name: course_name})

    reader.close()