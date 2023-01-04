"use strict";
const Students = [
    {
        id: "1",
        age: 21,
        fullName: "Rena Rustemova",
        academicYear: 4,
        group: 601.19,
        grades: [
            {
                id: "1",
                name: "Science",
                grade: 94,
            },
            {
                id: "2",
                name: "Math",
                grade: 97,
            },
        ],
    },
    {
        id: "2",
        age: 21,
        fullName: "Nezrin Ismayilli",
        academicYear: 4,
        group: 601.19,
        grades: [
            {
                id: "1",
                name: "Science",
                grade: 75,
            },
            {
                id: "2",
                name: "Math",
                grade: 65,
            },
        ],
    },
    {
        id: "3",
        age: 21,
        fullName: "Ayten Qurbanova",
        academicYear: 4,
        group: 691.19,
        grades: [
            {
                id: "1",
                name: "Science",
                grade: 99,
            },
            {
                id: "2",
                name: "Math",
                grade: 99,
            },
        ],
    },
];
const form = document.getElementById("form");
const gradeForm = document.getElementById("gradeForm");
const getStudentScore = document.getElementById("getStudentScore");
const findStudent = document.getElementById("findStudent");
const getHighScoredStudent = document.getElementById("getHighScoredStudent");
const inputs = document.querySelectorAll("input");
form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const fullName = formData.get("fullName");
    const studentAge = formData.get("age");
    const academicYear = Number(formData.get("academicYear"));
    const group = formData.get("group");
    const scopeOfStudy = formData.get("scopeOfStudy");
    const id = (Students.length + 1).toString();
    const age = checkAge(studentAge) ? parseInt(studentAge) : 0;
    if (checkData({ fullName, age, academicYear, group, scopeOfStudy })) {
        Students.push({
            id: id,
            fullName,
            age,
            grades: [],
            academicYear,
            group,
            scopeOfStudy,
        });
        for (const i of inputs) {
            i.value = "";
        }
        const textarea = document.getElementById("scopeOfStudy");
        textarea.value = "";
        const inputId = document.getElementById("studentId");
        inputId.value = id;
        alert(`Student created, your student id : ${id}`);
    }
    else
        alert("Student couldn't created");
};
gradeForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(gradeForm);
    const lessonName = formData.get("lessonName");
    const studentId = formData.get("studentId");
    const grade = Number(formData.get("grade"));
    if (checkData({ lessonName, studentId, grade })) {
        const gradeId = (searchStudentWithId(studentId)?.grades.length + 1).toString();
        searchStudentWithId(studentId)?.grades.push({
            id: gradeId,
            name: lessonName,
            grade: grade,
        });
        alert("Grade successfully added");
    }
    else
        alert("Something happened");
};
const checkAge = (age) => (parseInt(age) ? true : false);
const searchStudentWithId = (studentId) => {
    const student = Students.find(({ id }) => id === studentId);
    return student ? student : throwError("This student don't exist");
};
const throwError = (errorMsg) => {
    throw new Error(errorMsg);
};
const checkData = (data) => {
    for (const val of Object.values(data)) {
        if (!val) {
            return throwError("Something happened"), false;
        }
    }
    return true;
};
const calculateScore = (studentId) => {
    const student = Students.find(({ id }) => id === studentId);
    if (student === undefined) {
        return throwError("Student don't exist");
    }
    else if (student.grades.length === 0) {
        return throwError("Student don't exist grades");
    }
    let score = 0;
    student.grades.map(({ grade }) => (score += grade));
    score = score / Math.round(student.grades.length);
    return score;
};
getStudentScore.onclick = () => {
    const studentId = prompt("Enter student id: ");
    checkData({ studentId }) && console.log(calculateScore(studentId));
};
findStudent.onclick = () => {
    const studentId = prompt("Enter student id: ");
    return (checkData({ studentId }) &&
        console.log(Students.find(({ id }) => id === studentId)));
};
getHighScoredStudent.onclick = () => {
    console.log(getHighScore());
};
const getHighScore = () => {
    const scores = {};
    Students.map(({ fullName, id }) => Object.assign(scores, { [fullName]: calculateScore(id) }));
    const keys = Object.keys(scores);
    let max = scores[keys[0]];
    let name = "";
    for (let i = 1; i < keys.length; i++) {
        const value = scores[keys[i]];
        if (value > max) {
            max = value;
            name = keys[i];
        }
    }
    return { score: max, name };
};
