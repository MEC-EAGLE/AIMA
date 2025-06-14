from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin


db = SQLAlchemy()

group_members = db.Table(
    "group_members",
    db.Column("group_id", db.Integer, db.ForeignKey("group.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(40), unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), default="member")
    is_verified = db.Column(db.Boolean, default=False)


class Organization(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    contact_email = db.Column(db.String(120))


class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey("organization.id"))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    organization = db.relationship("Organization", backref="jobs")


class Internship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey("organization.id"))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    organization = db.relationship("Organization", backref="internships")


class Volunteering(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey("organization.id"))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    organization = db.relationship("Organization", backref="volunteering")


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    owner = db.relationship("User", backref="projects")


class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    owner = db.relationship("User", backref="groups")
    members = db.relationship(
        "User", secondary=group_members, backref="member_groups", lazy="dynamic"
    )


class MemberProfile(db.Model):
    id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    name = db.Column(db.String(100))
    skills = db.Column(db.Text)
    resume = db.Column(db.String(200))
    user = db.relationship("User", backref=db.backref("profile", uselist=False))


class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    job_id = db.Column(db.Integer, db.ForeignKey("job.id"))
    status = db.Column(db.String(20), default="applied")
    user = db.relationship("User", backref="applications")
    job = db.relationship("Job", backref="applications")


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    title = db.Column(db.String(100))
    start_time = db.Column(db.DateTime)
    user = db.relationship("User", backref="events")
