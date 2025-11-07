const courses = [
  { subject: "CSE", number: 110, title: "Intro to Programming", credits: 2, completed: true },
  { subject: "WDD", number: 130, title: "Web Fundamentals", credits: 2, completed: true },
  { subject: "WDD", number: 131, title: "Dynamic Web Fundamentals", credits: 2, completed: true },
  { subject: "WDD", number: 231, title: "Frontend Web Development I", credits: 2, completed: false },
  { subject: "CSE", number: 111, title: "Programming with Functions", credits: 2, completed: true },
  { subject: "CSE", number: 210, title: "Programming with Classes", credits: 2, completed: true },
];

const container = document.getElementById("courseContainer");
const total = document.getElementById("totalCredits");

function displayCourses(list) {
  container.innerHTML = "";
  let credits = 0;

  list.forEach(course => {
    const div = document.createElement("div");
    div.classList.add("course");
    if (course.completed) div.classList.add("completed");

    div.innerHTML = `<strong>${course.subject} ${course.number}</strong> - ${course.title}`;
    container.appendChild(div);
    credits += course.credits;
  });

  total.textContent = `The total credits for courses listed above is ${credits}`;
}

document.getElementById("all").addEventListener("click", () => displayCourses(courses));
document.getElementById("cse").addEventListener("click", () => displayCourses(courses.filter(c => c.subject === "CSE")));
document.getElementById("wdd").addEventListener("click", () => displayCourses(courses.filter(c => c.subject === "WDD")));

displayCourses(courses);