import os
import sys

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base, SessionLocal
from app.models.course import Course
from app.models.instructor import Instructor
from app.models.schedule import Schedule
from app.models.enrollment import Enrollment
from app.models.user import User
from app.auth.hash import get_password_hash

def init_db():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Seeding Admin
        if db.query(User).filter(User.role == "Admin").count() == 0:
            print("Seeding database with default administrator...")
            admin_user = User(
                full_name="Leveluxe Administrator",
                email="admin@leveluxe.com",
                phone="+91 99999 88888",
                password_hash=get_password_hash("Admin@123"),
                role="Admin",
                is_active=True,
                is_verified=True
            )
            db.add(admin_user)
            db.commit()
            print("Default admin successfully seeded!")
        else:
            print("Admin already exists. Skipping.")

        # Seeding Courses
        if db.query(Course).count() == 0:
            print("Seeding database with modern music academy courses...")
            mock_courses = [
                Course(
                    title="Guitar (Acoustic & Electric)",
                    instrument="Guitar",
                    level="Beginner",
                    duration="24 Weeks",
                    fees=12000.0,
                    description="Master acoustic and electric guitar. Learn essential chord shapes, strumming patterns, fingerstyle techniques, and soloing scales.",
                    image_url="/images/guitar.png"
                ),
                Course(
                    title="Piano (Classical & Modern)",
                    instrument="Piano",
                    level="Intermediate",
                    duration="36 Weeks",
                    fees=18000.0,
                    description="Develop solid classical foundations and modern styles. Covers sight-reading, dual-hand coordination, scale structures, and expressive solos.",
                    image_url="/images/piano.png"
                ),
                Course(
                    title="Keyboard (Synthesizer)",
                    instrument="Keyboard",
                    level="Beginner",
                    duration="24 Weeks",
                    fees=10000.0,
                    description="Explore keyboard play, synth sound-design, rhythm mapping, chords, and live stage accompaniment techniques.",
                    image_url="/images/keyboard.png"
                ),
                Course(
                    title="Violin (Classical Repertoire)",
                    instrument="Violin",
                    level="Advanced",
                    duration="48 Weeks",
                    fees=24000.0,
                    description="Acquire correct body posture, violin bowing control, perfect pitch intonation, and study classic string compositions.",
                    image_url="/images/violin.png"
                ),
                Course(
                    title="Drums & Percussion",
                    instrument="Drums",
                    level="Beginner",
                    duration="24 Weeks",
                    fees=15000.0,
                    description="Build tempo accuracy, four-way limb coordination, stick grip control, grooves, and play along with pop, rock, and jazz beats.",
                    image_url="/images/drums.png"
                ),
                Course(
                    title="Vocal Music Training",
                    instrument="Vocal",
                    level="Beginner",
                    duration="12 Weeks",
                    fees=9000.0,
                    description="Improve pitch accuracy, lung/breath control, vocal projection, articulation, style expression, and vocal cords health.",
                    image_url="/images/vocals.png"
                )
            ]
            db.add_all(mock_courses)
            db.commit()
            print("Mock courses successfully seeded!")
        else:
            print("Courses already seeded. Skipping.")

        # Seeding Instructors
        if db.query(Instructor).count() == 0:
            print("Seeding database with modern music academy instructors...")
            mock_instructors = [
                Instructor(
                    full_name="Arjun Rao",
                    instrument="Guitar",
                    qualification="Trinity College London Grade 8 (Guitar)",
                    experience_years=8,
                    bio="Arjun is a seasoned lead guitarist who has toured with several indie-rock bands across India. He specializes in fingerstyle techniques, blues phrasing, and rock improvisation.",
                    languages="English, Telugu",
                    specialization="Rock, Blues & Acoustic Fingerstyle Soloing",
                    image_url=""
                ),
                Instructor(
                    full_name="Meera Sharma",
                    instrument="Piano",
                    qualification="Master of Music (ABRSM Certified)",
                    experience_years=10,
                    bio="Meera has over a decade of teaching classical piano. She focuses on keyboard technique, sight-reading, ear training, and preparing students for ABRSM examinations.",
                    languages="English, Hindi",
                    specialization="Classical Composition & Intermediate-Advanced Repertoire",
                    image_url=""
                ),
                Instructor(
                    full_name="Rahul Verma",
                    instrument="Drums",
                    qualification="Rockschool London Grade 8 (Drums)",
                    experience_years=7,
                    bio="Rahul is a percussion specialist active in Hyderabad's session music circuit. He teaches tempo precision, coordinate independence, drum fills, and rock/pop grooves.",
                    languages="English, Hindi, Telugu",
                    specialization="Rock, Metal & Funk Rhythmic Syncopation",
                    image_url=""
                ),
                Instructor(
                    full_name="Ananya Iyer",
                    instrument="Violin",
                    qualification="Diploma in Violin Performance (TCL)",
                    experience_years=9,
                    bio="Ananya teaches violin with a focus on classical bowing mechanics, perfect intonation, and posture. She has performed with several string orchestras.",
                    languages="English, Tamil",
                    specialization="Classical Violin Repertoire & Bowing Dynamics",
                    image_url=""
                ),
                Instructor(
                    full_name="Kiran Kumar",
                    instrument="Keyboard",
                    qualification="Grade 7 Rockschool Keyboard",
                    experience_years=6,
                    bio="Kiran is a synthesizer sound design expert and arrangement designer. He teaches keyboard accompaniment, pitch modulation, and synth controls.",
                    languages="English, Kannada",
                    specialization="Synthesizer Sound Mapping & MIDI Arranging",
                    image_url=""
                ),
                Instructor(
                    full_name="Sneha Reddy",
                    instrument="Vocals",
                    qualification="B.A. in Music (Vocal Performance)",
                    experience_years=12,
                    bio="Sneha has coached over 300 vocalists. She specializes in breathing alignment, range extension, pitch accuracy, style expression, and vocal health.",
                    languages="English, Telugu, Hindi",
                    specialization="Pop, Soul & Western Classical Vocal Technique",
                    image_url=""
                )
            ]
            db.add_all(mock_instructors)
            db.commit()
            print("Mock instructors successfully seeded!")
        else:
            print("Instructors already seeded. Skipping.")

        # Seeding Schedules
        if db.query(Schedule).count() == 0:
            print("Seeding database with academy class schedules...")
            mock_schedules = [
                Schedule(
                    course_name="Guitar (Acoustic & Electric)",
                    instructor="Arjun Rao",
                    day="Monday",
                    start_time="09:00 AM",
                    end_time="10:30 AM",
                    batch="Morning Batch",
                    level="Beginner",
                    room="Room A",
                    available_seats=8
                ),
                Schedule(
                    course_name="Piano (Classical & Modern)",
                    instructor="Meera Sharma",
                    day="Monday",
                    start_time="11:00 AM",
                    end_time="12:30 PM",
                    batch="Morning Batch",
                    level="Intermediate",
                    room="Room B",
                    available_seats=5
                ),
                Schedule(
                    course_name="Drums & Percussion",
                    instructor="Rahul Verma",
                    day="Monday",
                    start_time="05:30 PM",
                    end_time="07:00 PM",
                    batch="Evening Batch",
                    level="Beginner",
                    room="Room C",
                    available_seats=4
                ),
                Schedule(
                    course_name="Violin (Classical Repertoire)",
                    instructor="Ananya Iyer",
                    day="Tuesday",
                    start_time="10:00 AM",
                    end_time="11:30 AM",
                    batch="Morning Batch",
                    level="Advanced",
                    room="Room C",
                    available_seats=3
                ),
                Schedule(
                    course_name="Keyboard (Synthesizer)",
                    instructor="Kiran Kumar",
                    day="Tuesday",
                    start_time="02:00 PM",
                    end_time="03:30 PM",
                    batch="Afternoon Batch",
                    level="Beginner",
                    room="Room A",
                    available_seats=10
                ),
                Schedule(
                    course_name="Piano (Classical & Modern)",
                    instructor="Meera Sharma",
                    day="Tuesday",
                    start_time="05:30 PM",
                    end_time="07:00 PM",
                    batch="Evening Batch",
                    level="Intermediate",
                    room="Room B",
                    available_seats=6
                ),
                Schedule(
                    course_name="Vocal Music Training",
                    instructor="Sneha Reddy",
                    day="Wednesday",
                    start_time="09:00 AM",
                    end_time="10:30 AM",
                    batch="Morning Batch",
                    level="Beginner",
                    room="Room B",
                    available_seats=12
                ),
                Schedule(
                    course_name="Violin (Classical Repertoire)",
                    instructor="Ananya Iyer",
                    day="Wednesday",
                    start_time="04:00 PM",
                    end_time="05:30 PM",
                    batch="Afternoon Batch",
                    level="Advanced",
                    room="Room C",
                    available_seats=5
                ),
                Schedule(
                    course_name="Guitar (Acoustic & Electric)",
                    instructor="Arjun Rao",
                    day="Wednesday",
                    start_time="06:00 PM",
                    end_time="07:30 PM",
                    batch="Evening Batch",
                    level="Beginner",
                    room="Room A",
                    available_seats=7
                ),
                Schedule(
                    course_name="Keyboard (Synthesizer)",
                    instructor="Kiran Kumar",
                    day="Thursday",
                    start_time="10:00 AM",
                    end_time="11:30 AM",
                    batch="Morning Batch",
                    level="Beginner",
                    room="Room A",
                    available_seats=8
                ),
                Schedule(
                    course_name="Vocal Music Training",
                    instructor="Sneha Reddy",
                    day="Thursday",
                    start_time="02:00 PM",
                    end_time="03:30 PM",
                    batch="Afternoon Batch",
                    level="Beginner",
                    room="Room B",
                    available_seats=10
                ),
                Schedule(
                    course_name="Drums & Percussion",
                    instructor="Rahul Verma",
                    day="Thursday",
                    start_time="05:30 PM",
                    end_time="07:00 PM",
                    batch="Evening Batch",
                    level="Beginner",
                    room="Room C",
                    available_seats=5
                ),
                Schedule(
                    course_name="Guitar (Acoustic & Electric)",
                    instructor="Arjun Rao",
                    day="Friday",
                    start_time="09:00 AM",
                    end_time="10:30 AM",
                    batch="Morning Batch",
                    level="Beginner",
                    room="Room A",
                    available_seats=9
                ),
                Schedule(
                    course_name="Piano (Classical & Modern)",
                    instructor="Meera Sharma",
                    day="Friday",
                    start_time="03:00 PM",
                    end_time="04:30 PM",
                    batch="Afternoon Batch",
                    level="Intermediate",
                    room="Room B",
                    available_seats=4
                ),
                Schedule(
                    course_name="Vocal Music Training",
                    instructor="Sneha Reddy",
                    day="Friday",
                    start_time="06:00 PM",
                    end_time="07:30 PM",
                    batch="Evening Batch",
                    level="Beginner",
                    room="Room B",
                    available_seats=8
                ),
                Schedule(
                    course_name="Drums & Percussion",
                    instructor="Rahul Verma",
                    day="Saturday",
                    start_time="10:00 AM",
                    end_time="11:30 AM",
                    batch="Morning Batch",
                    level="Beginner",
                    room="Room C",
                    available_seats=6
                ),
                Schedule(
                    course_name="Violin (Classical Repertoire)",
                    instructor="Ananya Iyer",
                    day="Saturday",
                    start_time="01:30 PM",
                    end_time="03:00 PM",
                    batch="Afternoon Batch",
                    level="Advanced",
                    room="Room C",
                    available_seats=4
                ),
                Schedule(
                    course_name="Keyboard (Synthesizer)",
                    instructor="Kiran Kumar",
                    day="Saturday",
                    start_time="05:00 PM",
                    end_time="06:30 PM",
                    batch="Evening Batch",
                    level="Beginner",
                    room="Room A",
                    available_seats=7
                )
            ]
            db.add_all(mock_schedules)
            db.commit()
            print("Mock schedules successfully seeded!")
        else:
            print("Schedules already seeded. Skipping.")

    except Exception as e:
        db.rollback()
        print(f"Error occurred during seed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
