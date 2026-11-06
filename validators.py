
import re
from datetime import date

# Regular expressions
STUDENT_ID = re.compile(r"^\d{9}$")
FULLNAME = re.compile(r"^[A-Za-z][A-Za-z .'\-]{1,79}$")
EMAIL = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._%+-]*@usek\.edu\.lb$")
PHONE = re.compile(r"^\+961[ -]?(03|70|71|76|78|79|81)[ -]?\d{6}$")
GITHUB = re.compile(r"^https://github\.com/[A-Za-z0-9_-]+/?$")
HTTPS_URL = re.compile(r"^https://[^\s]+$")
MONTH = re.compile(r"^\d{4}-(0[1-9]|1[0-2])$")
TIME = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
HEXCOLOR = re.compile(r"^#[0-9A-Fa-f]{6}$")

MAJORS = {
    "computer", "electrical", "biomedical",
    "telecommunications"
}

GRADUATION = {"spring", "summer", "fall"}

YESNO = {"yes", "no"}

SKILLS = {
    "Programming",
    "Embedded Systems",
    "Electronics",
    "Computer Networks",
    "Telecommunications",
    "Biomedical Instruments",
    "Machine Learning",
    "Signal Processing"
}

SOFTWARE = {
    "MATLAB",
    "LabVIEW",
    "CAD Software",
    "Simulink",
    "Multisim",
    "PpiSce"
}

PROJECT_AREAS = {
    "Programming",
    "Embedded Systems",
    "Electronics",
    "Computer Networks",
    "Telecommunications",
    "Biomedical Instruments",
    "Machine Learning",
    "Signal Processing"
}

REQUIRED = {
    "student_id", "fullname", "email",
    "major", "graduation"
}


def parse_date(text):
    try:
        return date.fromisoformat(text)
    except ValueError:
        return None


def to_number(text):
    try:
        return float(text)
    except ValueError:
        return None


def to_int(text):
    try:
        return int(text)
    except ValueError:
        return None


def validate_profile(form):
    errors = {}
    cleaned = {}

    # 1. Required fields
    for field in REQUIRED:
        if form.get(field, "").strip() == "":
            errors[field] = "This field is required."

    # 2. Student ID
    student_id = form.get("student_id", "").strip()

    if student_id != "" and not STUDENT_ID.fullmatch(student_id):
        errors["student_id"] = "Student ID must be exactly 9 digits."

    cleaned["student_id"] = student_id

    # 3. Full name
    fullname = form.get("fullname", "").strip()

    if fullname != "" and not FULLNAME.fullmatch(fullname):
        errors["fullname"] = (
            "Use letters, spaces, hyphens or apostrophes (2-80 chars)."
        )

    cleaned["fullname"] = fullname

    # 4. Email
    email = form.get("email", "").strip()

    if email != "" and not EMAIL.fullmatch(email):
        errors["email"] = "Use your USEK email (...@usek.edu.lb)."

    cleaned["email"] = email

    # 5. Phone
    phone = form.get("phone", "").strip()

    if phone != "" and not PHONE.fullmatch(phone):
        errors["phone"] = (
            "Enter a valid Lebanese number, e.g. +961 70 123456."
        )

    cleaned["phone"] = phone

    # 6. Birthdate
    birthdate = form.get("birthdate", "").strip()

    if birthdate != "":
        day = parse_date(birthdate)

        if day is None:
            errors["birthdate"] = "Not a valid date."

        elif day > date.today():
            errors["birthdate"] = (
                "Date of birth cannot be in the future."
            )

        else:
            age = (
                date.today().year - day.year
                - ((date.today().month, date.today().day)
                   < (day.month, day.day))
            )

            if age < 15 or age > 100:
                errors["birthdate"] = "Age looks out of range."

    cleaned["birthdate"] = birthdate

    # 7. GitHub
    github = form.get("github", "").strip()

    if github != "" and not GITHUB.fullmatch(github):
        errors["github"] = (
            "Use a GitHub URL: https://github.com/username"
        )

    cleaned["github"] = github

    # 8. GIN446 URL
    gin446 = form.get("gin446", "").strip()

    if gin446 != "" and not HTTPS_URL.fullmatch(gin446):
        errors["gin446"] = "Enter a valid https:// link."

    cleaned["gin446"] = gin446

    # 9. Major
    major = form.get("major", "").strip().lower()

    if major != "" and major not in MAJORS:
        errors["major"] = "Choose a valid major."

    cleaned["major"] = major

    # 10. GPA
    gpa = form.get("gpa", "").strip()

    if gpa != "":
        number = to_number(gpa)

        if number is None or not (40 <= number <= 100):
            errors["gpa"] = (
                "GPA must be a number between 40 and 100."
            )

    cleaned["gpa"] = gpa

    # 11. Credits
    credits = form.get("credits", "").strip()

    if credits != "":
        number = to_int(credits)

        if number is None or number < 0 or number > 148:
            errors["credits"] = (
                "Credits must be a whole number between 0 and 148."
            )

    cleaned["credits"] = credits

    # 12. Graduation
    graduation = form.get("graduation", "").strip().lower()

    if graduation != "" and graduation not in GRADUATION:
        errors["graduation"] = (
            "Choose spring, summer or fall."
        )

    cleaned["graduation"] = graduation

    # 13. Graduation month
    graduation_month = form.get("graduation_month", "").strip()

    if graduation_month != "" and not MONTH.fullmatch(graduation_month):
        errors["graduation_month"] = (
            "Use the month picker (YYYY-MM)."
        )

    cleaned["graduation_month"] = graduation_month

    # 14. Internship
    internship_completed = (
        form.get("internship_completed", "").strip().lower()
    )

    if internship_completed != "" and internship_completed not in YESNO:
        errors["internship_completed"] = "Choose yes or no."

    cleaned["internship_completed"] = internship_completed

    # 15. Programming language
    language = form.get("language", "").strip()

    if len(language) > 40:
        errors["language"] = "Keep it under 40 characters."

    cleaned["language"] = language

    # 16. Skills
    skills = form.getlist("skills")

    good_skills = []
    bad_skills = []

    for skill in skills:
        if skill in SKILLS:
            good_skills.append(skill)
        else:
            bad_skills.append(skill)

    if bad_skills:
        errors["skills"] = (
            "Unknown skill(s): " + ", ".join(bad_skills)
        )

    cleaned["skills"] = good_skills

    # 17. Software
    software = form.getlist("software")

    good_software = []
    bad_software = []

    for item in software:
        if item in SOFTWARE:
            good_software.append(item)
        else:
            bad_software.append(item)

    if bad_software:
        errors["software"] = (
            "Unknown software: " + ", ".join(bad_software)
        )

    cleaned["software"] = good_software

    # 18. Project title
    project_title = form.get("project_title", "").strip()

    if len(project_title) > 120:
        errors["project_title"] = (
            "Title must be 120 characters or fewer."
        )

    cleaned["project_title"] = project_title

    # 19. Project area
    project_area = form.get("project_area", "").strip()

    if project_area != "" and project_area not in PROJECT_AREAS:
        errors["project_area"] = "Choose a valid project area."

    cleaned["project_area"] = project_area

    # 20. Description
    description = form.get("description", "").strip()

    if len(description) > 1000:
        errors["description"] = (
            "Description must be 1000 characters or fewer."
        )

    cleaned["description"] = description

    # 21. Team size
    team_size = form.get("team_size", "").strip()

    if team_size != "":
        number = to_int(team_size)

        if number is None or number < 1 or number > 4:
            errors["team_size"] = (
                "Team size must be a whole number from 1 to 4."
            )

    cleaned["team_size"] = team_size

    # 22. Project color
    project_color = form.get("project_color", "").strip()

    if project_color != "" and not HEXCOLOR.fullmatch(project_color):
        errors["project_color"] = "Use a colour like #336699."

    if project_color == "":
        project_color = "#336699"

    cleaned["project_color"] = project_color

    # 23. Meeting date
    meeting_date = form.get("meeting_date", "").strip()

    if meeting_date != "":
        day = parse_date(meeting_date)

        if day is None:
            errors["meeting_date"] = "Not a valid date."

    cleaned["meeting_date"] = meeting_date

    # 24. Meeting time
    meeting_time = form.get("meeting_time", "").strip()

    if meeting_time != "":
        if not TIME.fullmatch(meeting_time):
            errors["meeting_time"] = "Use HH:MM."

        elif meeting_time < "08:00" or meeting_time > "18:00":
            errors["meeting_time"] = (
                "Pick a time between 08:00 and 18:00."
            )

    cleaned["meeting_time"] = meeting_time

    # 25. Confirmation
    confirmation = form.get("confirmation", "")

    if confirmation != "on":
        errors["confirmation"] = (
            "You must confirm the information is accurate."
        )

    cleaned["confirmation"] = confirmation

    return errors, cleaned


