const User = require("./models/user");
const Course = require("./models/course");
const Unit = require("./models/unit");
const Lesson = require("./models/lesson");
const UserLesson = require("./models/user_lesson");

async function seed() {
    // Create Users
    await User.register("Mosh", "moshpass");
    await User.register("BroCode", "bropass")
    await User.register("student1","pass1");
    await User.register("student2","pass2");
    await User.register("student3","pass3");
    // Create Courses
    const FED = await Course.create({
        creatorUsername: "Mosh",
        title: "Front End Devlopement",
        about: "learn the basics of front end developement"
    });
    const BED = await Course.create({
        creatorUsername: "Mosh",
        title: "Back end Developement",
        about: "learn the basics of back end developement"
    })
    const mySQL = await Course.create({
        creatorUsername: "BroCode",
        title: "MySQL for beginners",
        about: "learn mySQL for free"
    })
    const DSA = await Course.create({
        creatorUsername: "BroCode",
        title: "Data Structures and Algorithms",
        about: "learn about how to organize your data"
    })
    // Create Units
    const react = await Unit.create({
        title: "React",
        courseId: FED.id,
        unitOrder: 1
    });
    const otherTopics = await Unit.create({
        title: "Other Topics",
        courseId: FED.id,
        unitOrder: 2
    });
    const node = await Unit.create({
        title:"Node",
        courseId: BED.id,
        unitOrder: 1
    });
    const python = await Unit.create({
        title:"Python",
        courseId: BED.id,
        unitOrder: 2
    });
    const sqlBasic = await Unit.create({
        title: "MySQL Basics",
        courseId: mySQL.id,
        unitOrder: 1
    });
    const sqlConstraints = await Unit.create({
        title: "MySQL Constraints",
        courseId: mySQL.id,
        unitOrder: 2
    })
    const otherSqlTopics = await Unit.create({
        title: "Other things to know in MySQL",
        courseId: mySQL.id,
        unitOrder: 3
    })
    const structures = await Unit.create({
        title: "Data Structures",
        courseId: DSA.id,
        unitOrder: 1
    })
    const search = await Unit.create({
        title: "Search",
        courseId: DSA.id,
        unitOrder: 2
    })
    const sorts = await Unit.create({
        title: "Sorts",
        courseId: DSA.id,
        unitOrder: 3
    })
    // Create Lessons
    await Lesson.create({
        title: "React JS - React Tutorial for Beginners",
        unitId: react.id,
        lessonOrder: 1,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/Ke90Tje7VS0"
    });
    await Lesson.create({
        title: "React Native Tutorial for Beginners - Build a React Native App",
        unitId: react.id,
        lessonOrder: 2,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/0-S5a0eXPoc"
    });
    await Lesson.create({
        title: "What is React (React js) & Why is it so Popular?",
        unitId: react.id,
        lessonOrder: 3,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/N3AkSS5hXMA"
    });
    await Lesson.create({
        title: "React vs Angular vs Vue: What to Learn to Get a Front-end Job",
        unitId: react.id,
        lessonOrder: 4,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/pEbIhUySqbk"
    });
    await Lesson.create({
        title: "Angular Tutorial for Beginners: Learn Angular & TypeScript",
        unitId: otherTopics.id,
        lessonOrder: 1,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/k5E2AVpwsko"
    });
    await Lesson.create({
        title: "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour",
        unitId: otherTopics.id,
        lessonOrder: 2,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/W6NZfCO5SIk"
    });
    await Lesson.create({
        title: "ES6 Tutorial: Learn Modern JavaScript in 1 Hour",
        unitId: otherTopics.id,
        lessonOrder: 3,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/NCwa_xi0Uuc"
    });
    await Lesson.create({
        title: "What is a REST API?",
        unitId: otherTopics.id,
        lessonOrder: 4,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/SLwpqD8n3d0"
    });
    await Lesson.create({
        title: "Git Tutorial for Beginners: Learn Git in 1 Hour",
        unitId: otherTopics.id,
        lessonOrder: 5,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/8JJ101D3knE"
    });
    await Lesson.create({
        title: "HTML Tutorial for Beginners: HTML Crash Course",
        unitId: otherTopics.id,
        lessonOrder: 6,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/qz0aGYrrlhU"
    });
    await Lesson.create({
        title: "TypeScript Tutorial for Beginners",
        unitId: otherTopics.id,
        lessonOrder: 7,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/d56mG7DezGs"
    });
    await Lesson.create({
        title: "What is Node js?",
        unitId: node.id,
        lessonOrder: 1,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/uVwtVBpw7RQ"
    });
    await Lesson.create({
        title: "Node.js Tutorial for Beginners: Learn Node in 1 Hour",
        unitId: node.id,
        lessonOrder: 2,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/TlB_eWDSMt4"
    });
    await Lesson.create({
        title: "How to build a REST API with Node js & Express",
        unitId: node.id,
        lessonOrder: 3,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/pKd0Rpw7O48"
    });
    await Lesson.create({
        title: "What is Python? Why Python is So Popular?",
        unitId: python.id,
        lessonOrder: 1,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/Y8Tko2YC5hA"
    });
    await Lesson.create({
        title: "Python Tutorial - Python Full Course for Beginners",
        unitId: python.id,
        lessonOrder: 2,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/_uQrJ0TkZlc"
    });
    await Lesson.create({
        title: "Python Django Tutorial for Beginners",
        unitId: python.id,
        lessonOrder: 3,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/rHux0gMZ3Eg"
    });
    await Lesson.create({
        title: "MySQL tutorial for beginners (intro + installation)",
        unitId: sqlBasic.id,
        lessonOrder: 1,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/oPV2sjMG53U"
    });
    await Lesson.create({
        title: "MySQL: How to create a DATABASE",
        unitId: sqlBasic.id,
        lessonOrder: 2,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/9LQ9rGoGfYQ"
    });
    await Lesson.create({
        title: "MySQL: How to create a TABLE",
        unitId: sqlBasic.id,
        lessonOrder: 3,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/XfrgCK6BX5w"
    });
    await Lesson.create({
        title: "MySQL: How to INSERT rows into a TABLE",
        unitId: sqlBasic.id,
        lessonOrder: 4,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/Cxilfg-M158"
    });
    await Lesson.create({
        title: "MySQL: How to SELECT data from a TABLE",
        unitId: sqlBasic.id,
        lessonOrder: 5,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/kUDznItqKbI"
    });
    await Lesson.create({
        title: "MySQL: How to UPDATE and DELETE data from a TABLE",
        unitId: sqlBasic.id,
        lessonOrder: 6,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/OB2leB2iZ6U"
    });
    await Lesson.create({
        title: "MySQL: AUTOCOMMIT, COMMIT, ROLLBACK",
        unitId: sqlBasic.id,
        lessonOrder: 7,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/GOQVlrQohtM"
    });
    await Lesson.create({
        title: "MySQL: CURRENT_DATE() & CURRENT_TIME()",
        unitId: sqlBasic.id,
        lessonOrder: 8,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/YEGM_S8mQEI"
    });
    await Lesson.create({
        title: "MySQL: UNIQUE constraint",
        unitId: sqlConstraints.id,
        lessonOrder: 1,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/Of_-2pBeL0g"
    });
    await Lesson.create({
        title: "MySQL: NOT NULL constraint",
        unitId: sqlConstraints.id,
        lessonOrder: 2,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/unzHhq82mKU"
    });
    await Lesson.create({
        title: "MySQL: CHECK constraint is easy",
        unitId: sqlConstraints.id,
        lessonOrder: 3,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/EeG2boJCXbc"
    });
    await Lesson.create({
        title: "MySQL: DEFAULT constraint is easy",
        unitId: sqlConstraints.id,
        lessonOrder: 4,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/f4DEKHc9wLk"
    });
    await Lesson.create({
        title: "MySQL: PRIMARY KEYS are easy",
        unitId: sqlConstraints.id,
        lessonOrder: 5,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/620DzFVz41o"
    });
    await Lesson.create({
        title: "MySQL: AUTO_INCREMENT is awesome",
        unitId: sqlConstraints.id,
        lessonOrder: 6,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/ALht4W2QxqY"
    });
    await Lesson.create({
        title: "MySQL: FOREIGN KEYS are easy (kind of)",
        unitId: sqlConstraints.id,
        lessonOrder: 7,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/rFssfx37UJw"
    });
    await Lesson.create({
        title: "MySQL: JOINS are easy (INNER, LEFT, RIGHT)",
        unitId: otherSqlTopics.id,
        lessonOrder: 1,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/G3lJAxg1cy8"
    });
    await Lesson.create({
        title: "Functions in MySQL are easy",
        unitId: otherSqlTopics.id,
        lessonOrder: 2,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/9HXJUGT-06w"
    });
    await Lesson.create({
        title: "MySQL logical operators are easy",
        unitId: otherSqlTopics.id,
        lessonOrder: 3,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/lScJW5Qz_5k"
    });
    await Lesson.create({
        title: "MySQL wild cards are easy",
        unitId: otherSqlTopics.id,
        lessonOrder: 4,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/T11d2ScMtk8"
    });
    await Lesson.create({
        title: "MySQL ORDER BY clause is easy",
        unitId: otherSqlTopics.id,
        lessonOrder: 5,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/R-5F3BF8IeY"
    });
    await Lesson.create({
        title: "MySQL LIMIT clause is easy",
        unitId: otherSqlTopics.id,
        lessonOrder: 6,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/q-kZ8Rq58MY"
    });
    await Lesson.create({
        title: "MySQL UNIONS are easy",
        unitId: otherSqlTopics.id,
        lessonOrder: 7,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/su-fxrvKTCk"
    });
    await Lesson.create({
        title: "MySQL SELF JOINS are ... ughhh",
        unitId: otherSqlTopics.id,
        lessonOrder: 8,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/lweF--_3Pk8"
    });
    await Lesson.create({
        title: "MySQL VIEWS are awesome",
        unitId: otherSqlTopics.id,
        lessonOrder: 9,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/wciubfRhvtM"
    });
    await Lesson.create({
        title: "MySQL: INDEXES are awesome",
        unitId: otherSqlTopics.id,
        lessonOrder: 10,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/t0grczCICMk"
    });
    await Lesson.create({
        title: "MySQL: SUBQUERIES",
        unitId: otherSqlTopics.id,
        lessonOrder: 11,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/i5acg3Hvu6g"
    });
    await Lesson.create({
        title: "MySQL: GROUP BY",
        unitId: otherSqlTopics.id,
        lessonOrder: 12,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/FztbYXeOEQ4"
    });
    await Lesson.create({
        title: "MySQL: ROLLUP",
        unitId: otherSqlTopics.id,
        lessonOrder: 13,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/6FwQBS3jV_I"
    });
    await Lesson.create({
        title: "MySQL: ON DELETE",
        unitId: otherSqlTopics.id,
        lessonOrder: 14,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/vANfY96ccOY"
    });
    await Lesson.create({
        title: "MySQL: STORED PROCEDURES",
        unitId: otherSqlTopics.id,
        lessonOrder: 15,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/oagHZwY9JJY"
    });
    await Lesson.create({
        title: "MySQL: TRIGGERS",
        unitId: otherSqlTopics.id,
        lessonOrder: 16,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/jVbj72YO-8s"
    });
    await Lesson.create({
        title: "What are data structures and algorithms?",
        unitId: structures.id,
        lessonOrder: 1,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/xX5iOYCJmBI"
    });
    await Lesson.create({
        title: "Learn Stack data structures in 10 minutes",
        unitId: structures.id,
        lessonOrder: 2,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/KInG04mAjO0"
    });
    await Lesson.create({
        title: "Learn Queue data structures in 10 minutes",
        unitId: structures.id,
        lessonOrder: 3,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/nqXaPZi99JI"
    });
    await Lesson.create({
        title: "Learn Priority Queue data structures in 5 minutes",
        unitId: structures.id,
        lessonOrder: 4,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/7z_HXFZqXqc"
    });
    await Lesson.create({
        title: "Learn Linked Lists in 13 minutes",
        unitId: structures.id,
        lessonOrder: 5,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/N6dOwBde7-M"
    });
    await Lesson.create({
        title: "Dynamic Arrays",
        unitId: structures.id,
        lessonOrder: 6,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/jzJlq35dQII"
    });
    await Lesson.create({
        title: "LinkedLists vs ArrayLists",
        unitId: structures.id,
        lessonOrder: 7,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/30MKAcoffIo"
    });
    await Lesson.create({
        title: "Learn Big O notation in 6 minutes",
        unitId: search.id,
        lessonOrder: 1,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/XMUe3zFhM5c"
    });
    await Lesson.create({
        title: "Learn Linear Search in 3 minutes",
        unitId: search.id,
        lessonOrder: 2,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/246V51AWwZM"
    });
    await Lesson.create({
        title: "Learn Binary Search in 10 minutes",
        unitId: search.id,
        lessonOrder: 3,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/xrMppTpoqdw"
    });
    await Lesson.create({
        title: "Learn Interpolation search in 8 minutes",
        unitId: search.id,
        lessonOrder: 4,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/YSVS5GG1JuI"
    });
    await Lesson.create({
        title: "Learn Bubble Sort in 7 minutes",
        unitId: sorts.id,
        lessonOrder: 1,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/Dv4qLJcxus8"
    });
    await Lesson.create({
        title: "Learn Selection Sort in 8 minutes",
        unitId: sorts.id,
        lessonOrder: 2,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/EwjnF7rFLns"
    });
    await Lesson.create({
        title: "Learn Insertion Sort in 7 minutes",
        unitId: sorts.id,
        lessonOrder: 3,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/8mJ-OhcfpYg"
    });
    await Lesson.create({
        title: "Learn Merge Sort in 13 minutes ",
        unitId: sorts.id,
        lessonOrder: 4,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/3j0SWDX4AtU"
    });
    await Lesson.create({
        title: "Learn Quick Sort in 13 minutes ",
        unitId: sorts.id,
        lessonOrder: 5,
        lessonType: "video",
        lessonURL: "https://www.youtube.com/embed/Vtckgz38QHs"
    });
    // Create UserLessons
    await UserLesson.addCourse("student1", FED.id);
    await UserLesson.addCourse("student1", BED.id);
    await UserLesson.addCourse("student2", FED.id);
    await UserLesson.addCourse("student2", mySQL.id);
    await UserLesson.addCourse("student3", FED.id);
    await UserLesson.addCourse("student3", BED.id);
    await UserLesson.addCourse("student3", DSA.id);
}

seed()