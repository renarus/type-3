type StudentType = {
  id: string;
  age: number;
  grades: GradeType[];
  fullName: string;
  academicYear: number;
  group: string | number;
  scopeOfStudy?: string;
};

type GradeType = {
  id: string;
  name: string;
  grade: number;
};

const Students: StudentType[] = [
  {
    id: "1",
    age: 21,
    fullName: "Fuad Bayramov",
    academicYear: 4,
    group: 691.19,
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
    fullName: "Fuad Bayramov2",
    academicYear: 4,
    group: 691.19,
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
    fullName: "Fuad Bayramov2",
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

const form = document.getElementById("form") as HTMLFormElement;
const gradeForm = document.getElementById("gradeForm") as HTMLFormElement;
const getStudentScore = document.getElementById(
  "getStudentScore"
) as HTMLButtonElement;
const findStudent = document.getElementById("findStudent") as HTMLButtonElement;
const getHighScoredStudent = document.getElementById(
  "getHighScoredStudent"
) as HTMLButtonElement;
const inputs = document.querySelectorAll("input");

form.onsubmit = (e: SubmitEvent) => {
  e.preventDefault();
  const formData = new FormData(form);
  const fullName = formData.get("fullName") as FormDataEntryValue as string;
  const studentAge = formData.get("age") as FormDataEntryValue as string;
  const academicYear = Number(formData.get("academicYear")) as number;
  const group = formData.get("group") as FormDataEntryValue as string;
  const scopeOfStudy = formData.get(
    "scopeOfStudy"
  ) as FormDataEntryValue as string;

  const id: string = (Students.length + 1).toString();
  const age: number = checkAge(studentAge) ? parseInt(studentAge) : 0;
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
    const textarea = document.getElementById(
      "scopeOfStudy"
    ) as HTMLTextAreaElement;
    textarea.value = "";
    const inputId = document.getElementById("studentId") as HTMLInputElement;
    inputId.value = id;

    alert(`Student created, your student id : ${id}`);
  } else alert("Student couldn't created");
};

gradeForm.onsubmit = (e: SubmitEvent) => {
  e.preventDefault();
  const formData = new FormData(gradeForm);
  const lessonName = formData.get("lessonName") as FormDataEntryValue as string;
  const studentId = formData.get("studentId") as FormDataEntryValue as string;
  const grade = Number(formData.get("grade") as FormDataEntryValue) as number;
  if (checkData({ lessonName, studentId, grade })) {
    const gradeId = (
      searchStudentWithId(studentId)?.grades.length + 1
    ).toString();
    searchStudentWithId(studentId)?.grades.push({
      id: gradeId,
      name: lessonName,
      grade: grade,
    });
    alert("Grade successfully added");
  } else alert("Something happened");
};

const checkAge = (age: string): boolean => (parseInt(age) ? true : false);

const searchStudentWithId = (studentId: string): StudentType => {
  const student = Students.find(({ id }) => id === studentId);
  return student ? student : throwError("This student don't exist");
};

const throwError = (errorMsg: string): never => {
  throw new Error(errorMsg);
};

const checkData = (data: {}): boolean => {
  for (const val of Object.values(data)) {
    if (!val) {
      return throwError("Something happened"), false;
    }
  }
  return true;
};

const calculateScore = (studentId: string): number => {
  const student = Students.find(({ id }) => id === studentId) as
    | StudentType
    | undefined;
  if (student === undefined) {
    return throwError("Student don't exist");
  } else if (student.grades.length === 0) {
    return throwError("Student don't exist grades");
  }
  let score = 0;
  student.grades.map(({ grade }) => (score += grade));
  score = score / Math.round(student.grades.length);
  return score;
};

getStudentScore.onclick = () => {
  const studentId = prompt("Enter student id: ") as string;
  checkData({ studentId }) && console.log(calculateScore(studentId));
};

findStudent.onclick = () => {
  const studentId = prompt("Enter student id: ") as string;
  return (
    checkData({ studentId }) &&
    console.log(Students.find(({ id }) => id === studentId))
  );
};

getHighScoredStudent.onclick = () => {
  console.log(getHighScore());
};

const getHighScore = (): { score: number; name: string } => {
  const scores = {} as any;
  Students.map(({ fullName, id }) =>
    Object.assign(scores, { [fullName]: calculateScore(id) })
  );
  const keys = Object.keys(scores);
  let max = scores[keys[0]];
  let name: string = "";
  for (let i = 1; i < keys.length; i++) {
    const value = scores[keys[i]];
    if (value > max) {
      max = value;
      name = keys[i];
    }
  }
  return { score: max, name };
};
