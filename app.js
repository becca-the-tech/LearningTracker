const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.er1mt.mongodb.net/coursesDB`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const courseSectionSchema = {
    title: String,
    amount: Number,
    isComplete: Boolean
};

const CourseSection = mongoose.model("courseSection", courseSectionSchema);

const courseSchema = {
    courseTitle: String,
    courseSections: [courseSectionSchema]
};

const Course = mongoose.model("Course", courseSchema);

const courseSectionNVSchema = {
    title: String,
    amount: Number,
    isComplete: Boolean
};

const CourseSectionNV = mongoose.model("courseSectionNV", courseSectionNVSchema);

const courseNVSchema = {
    courseTitle: String,
    courseSections: [courseSectionNVSchema]
};

const CourseNV = mongoose.model("CourseNV", courseNVSchema);

let newCourseSectionNV = new CourseSectionNV({
    title: "Learn Text Design",
    amount: 4,
    isComplete: false
});

let newCourseNV = new CourseNV({
    courseTitle: "Codecademy: Front End Development",
    courseSections: [newCourseSectionNV]
});

// newCourseNV.save();

app.get("/", function(req, res) {
    Course.find({}, function(err, courses) {
        if (!err) {
            res.render("tracker", {
                courses: courses
            });
        }
    });
});

app.get("/finished", function(req, res) {
    Course.find({}, function(err, courses) {
        if (!err) {
            res.render("finished", {
                courses: courses
            });
        }
    });
});

app.get("/unfinished", function(req, res) {
    Course.find({}, function(err, courses) {
        if (!err) {
            res.render("unfinished", {
                courses: courses
            });
        }
    });
});

app.get("/nonvideo", function(req, res) {
    CourseNV.find({}, function(err, courses) {
        if (!err) {
            res.render("nonVideo", {
                courses: courses
            });
        }
    });
});

// TODO: Eventually want to add feature of selecting the number of sections to show ///////
// app.get("/finished/show/:num", function(req, res) {
//     Course.find({}, function(err, courses) {
//         if (!err) {
//             res.render("finished", {
//                 courses: courses,
//                 number: req.params.num
//             });
//         }
//     });
// });

function numWeeks(numWeeks) {
    let now = new Date();
    let options = { month: "long", day: "numeric" };
    now.setDate(now.getDate() + numWeeks * 7);
    let formattedEnd = Intl.DateTimeFormat('en-US', options).format(now);
    return formattedEnd;
}

app.get("/plan", function(req, res) {
    res.render("plan", {
        defaultWeeks: numWeeks(12),
        chosenWeeks: numWeeks(12)
    });
});

app.post("/plan", function(req, res) {
    let weeks = req.body.numberWeeks;
    res.render("plan", {
        defaultWeeks: numWeeks(12),
        chosenWeeks: numWeeks(weeks)
    });
});

app.post("/addBtn", function(req, res) {
    const courseId = req.body.courseId;
    //    console.log(courseId);

    Course.findOne({ _id: courseId }, function(err, foundCourse) {
        if (!err) {
            res.render("addSection", {
                courseName: foundCourse.courseTitle,
                courseId: courseId
            });
        }

    });
});

app.post("/addSection", function(req, res) {
    const courseId = req.body.courseId;

    let newSection = {
        title: req.body.sectionTitle,
        amount: req.body.sectionAmount,
        isComplete: false,
    };

    Course.findOne({ _id: courseId }, function(err, foundCourse) {
        if (!err) {
            //          console.log(foundCourse);
            foundCourse.courseSections.push(newSection);
            foundCourse.save();
            res.redirect("/");
        } else {
            console.log(err);
        }
    });
});

//option to add new courses
app.get("/addCourse", function(req, res) {
    res.render("addCourse", {});
});

app.post("/addCourse", function(req, res) {
    let newCourseTitle = req.body.courseTitle;

    let newCourse = new Course({
        courseTitle: newCourseTitle,
        courseSections: []
    });

    newCourse.save();
    res.redirect("/");
});

app.post("/update", function(req, res) {
    const sectionId = req.body.sectionId;
    const courseId = req.body.courseId;

    Course.findOne({ _id: courseId }, function(err, foundCourse) {
        let sections = foundCourse.courseSections;
        sections.forEach(section => {
            if (section._id == sectionId) {
                if (section.isComplete == false) {
                    section.isComplete = true;
                } else {
                    section.isComplete = false;
                }
                foundCourse.save();
                res.redirect("/");
            }
        });
    });
});

app.get("/weeklyTracker", function(req, res) {
    let today = new Date();
    let options = { day: "numeric", weekday: "long", month: "long", year: "numeric" };

    res.render("weeklyTracker", { today: today.toLocaleString("en-US", options) });
});


///////////////////////////////////////// NON-VIDEO VERSIONS //////////////////////////////////
app.post("/addBtnNV", function(req, res) {
    const courseId = req.body.courseId;
    //    console.log(courseId);

    CourseNV.findOne({ _id: courseId }, function(err, foundCourse) {
        if (!err) {
            res.render("addSectionNV", {
                courseName: foundCourse.courseTitle,
                courseId: courseId
            });
        }

    });
});

app.post("/addSectionNV", function(req, res) {
    const courseId = req.body.courseId;

    let newSection = {
        title: req.body.sectionTitle,
        amount: req.body.sectionAmount,
        isComplete: false,
    };

    CourseNV.findOne({ _id: courseId }, function(err, foundCourse) {
        if (!err) {
            //          console.log(foundCourse);
            foundCourse.courseSections.push(newSection);
            foundCourse.save();
            res.redirect("/nonvideo");
        } else {
            console.log(err);
        }
    });
});

//option to add new courses
app.get("/addCourseNV", function(req, res) {
    res.render("addCourseNV", {});
});

app.post("/addCourseNV", function(req, res) {
    let newCourseTitle = req.body.courseTitle;

    let newCourse = new CourseNV({
        courseTitle: newCourseTitle,
        courseSections: []
    });

    newCourse.save();
    res.redirect("/nonVideo");
});

app.post("/updateNV", function(req, res) {
    const sectionId = req.body.sectionId;
    const courseId = req.body.courseId;

    CourseNV.findOne({ _id: courseId }, function(err, foundCourse) {
        let sections = foundCourse.courseSections;
        sections.forEach(section => {
            if (section._id == sectionId) {
                if (section.isComplete == false) {
                    section.isComplete = true;
                } else {
                    section.isComplete = false;
                }
                foundCourse.save();
                res.redirect("/nonvideo");
            }
        });
    });
});


app.get("/notebook", function(req, res) {
    res.render("notebook");
});


let port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("Server is listening on port 3000.");
});
