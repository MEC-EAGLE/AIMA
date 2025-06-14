from flask import Flask, render_template, redirect, url_for, request, flash
from flask_login import (
    LoginManager,
    login_user,
    login_required,
    logout_user,
    current_user,
)
from werkzeug.security import generate_password_hash, check_password_hash

from models import (
    db,
    User,
    Organization,
    Job,
    Internship,
    Volunteering,
    Project,
    Group,
    Application,
    Event,
)


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "dev"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    db.init_app(app)
    login_manager = LoginManager(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    @app.before_first_request
    def create_tables():
        db.create_all()

    @app.route("/")
    def index():
        jobs = Job.query.all()
        return render_template("index.html", jobs=jobs)

    @app.route("/internships")
    def internships():
        entries = Internship.query.all()
        return render_template("internships.html", internships=entries)

    @app.route("/volunteering")
    def volunteering():
        entries = Volunteering.query.all()
        return render_template("volunteering.html", opportunities=entries)

    @app.route("/projects")
    @login_required
    def projects():
        entries = Project.query.all()
        return render_template("projects.html", projects=entries)

    @app.route("/community")
    def community():
        members = User.query.all()
        return render_template("community.html", members=members)

    @app.route("/groups")
    def groups():
        groups = Group.query.all()
        return render_template("groups.html", groups=groups)

    @app.route("/groups/<int:group_id>/join")
    @login_required
    def join_group(group_id):
        group = Group.query.get_or_404(group_id)
        if current_user not in group.members.all():
            group.members.append(current_user)
            db.session.commit()
            flash("Joined group")
        return redirect(url_for("groups"))

    @app.route("/jobs/<int:job_id>/apply")
    @login_required
    def apply_job(job_id):
        job = Job.query.get_or_404(job_id)
        if not Application.query.filter_by(
            user_id=current_user.id, job_id=job.id
        ).first():
            app_entry = Application(user_id=current_user.id, job_id=job.id)
            db.session.add(app_entry)
            db.session.commit()
            flash("Application submitted")
        else:
            flash("Already applied")
        return redirect(url_for("index"))

    @app.route("/applications")
    @login_required
    def applications():
        entries = Application.query.filter_by(user_id=current_user.id).all()
        return render_template("applications.html", applications=entries)

    @app.route("/search")
    def search():
        q = request.args.get("q", "")
        jobs = Job.query.filter(Job.title.contains(q)).all()
        return render_template("search.html", jobs=jobs, query=q)

    @app.route("/register", methods=["GET", "POST"])
    def register():
        if request.method == "POST":
            email = request.form["email"]
            password = request.form["password"]
            if User.query.filter_by(email=email).first():
                flash("Email already registered")
                return redirect(url_for("register"))
            user = User(email=email, password_hash=generate_password_hash(password))
            db.session.add(user)
            db.session.commit()
            flash("Registration successful - verify email to proceed")
            return redirect(url_for("login"))
        return render_template("register.html")

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            email = request.form["email"]
            password = request.form["password"]
            user = User.query.filter_by(email=email).first()
            if user and check_password_hash(user.password_hash, password):
                login_user(user)
                return redirect(url_for("dashboard"))
            flash("Invalid credentials")
        return render_template("login.html")

    @app.route("/dashboard")
    @login_required
    def dashboard():
        return render_template("dashboard.html", user=current_user)

    @app.route("/logout")
    @login_required
    def logout():
        logout_user()
        return redirect(url_for("index"))

    return app


if __name__ == "__main__":
    create_app().run(debug=True)
