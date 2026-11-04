from validators import validate_profile
from flask import Flask, render_template, request
from quiz_api import init_quiz

app = Flask(__name__)
init_quiz(app)

@app.route("/")
def home():
    """Serve the portfolio home page."""
    weekly_work = [
        {"week": 2, "title": "History of the Internet", "url": "/internet-history"},
        {"week": 2, "title": "History of the Web", "url": "/web-history"},
        {"week": 2, "title": "History of the Internet (AI)", "url": "/internet-history-ai"},
        {"week": 2, "title": "History of the Web (AI)", "url": "/web-history-ai"},
        {"week": 4, "title": "Engineering Student Profile", "url": "/submit-profile"},
        {"week": 5, "title": "JavaScript app", "url": "/quiz"},
        {"week": 7, "title": "Live Quiz with Fetch", "url": "/live-quiz"},
        {"week": 8, "title": "Server-Side Rendering", "url": "/profile-validated"},
    ]
    return render_template("index.html", weekly_work=weekly_work)

@app.route("/internet-history")
def internet_history():
    return render_template("internet-history.html")

@app.route("/web-history")
def web_history():
    return render_template("web-history.html")

@app.route("/internet-history-ai")
def internet_history_ai():
    return render_template("internet-history-ai.html")

@app.route("/web-history-ai")
def web_history_ai():
    return render_template("web-history-ai.html")

@app.route("/submit-profile", methods=["GET", "POST"])
def submit_profile():
    """
    GET  -> show the profile form.
    POST -> read the submitted fields and show the profile page.
    """
    if request.method == "POST":
        data = request.form.to_dict()
        skills = request.form.getlist("skills")
        software = request.form.getlist("software")
        return render_template("profile.html", data=data, skills=skills, software=software)
    return render_template("profile-form.html")

@app.route("/quiz", methods=["GET", "POST"])
def quiz():
    return render_template("quiz.html")

@app.route("/profile-validated", methods=["GET", "POST"])
def profile_validated():
    if request.method == "POST":
        errors, cleaned = validate_profile(request.form)
        if errors:
            return render_template(
                "profile-form-validated.html",
                errors=errors, data=request.form,
                sel_skills=request.form.getlist("skills"),
                sel_software=request.form.getlist("software"),
            )
        return render_template(
            "profile_validated.html", data=cleaned,
            skills=cleaned.get("skills", []),
            software=cleaned.get("software", []),
        )
    return render_template(
        "profile-form-validated.html", errors={}, data={},
        sel_skills=[], sel_software=[],
    )

if __name__ == "__main__":
    app.run(debug=True)
