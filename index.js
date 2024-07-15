const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const studentsPath = path.join(__dirname, "db.json");

app.use(cors({
  origin: 'https://nodex-task-react.netlify.app/', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Student list endpoint
app.get("/students", (req, res) => {
  fs.readFile(studentsPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file: ", err);
      res.status(500).json({ error: "Error reading students file" });
      return;
    }

    const students = JSON.parse(data);
    res.json(students);
  });
});

// Specific student with ID endpoint
app.get("/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id);

  fs.readFile(studentsPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file: ", err);
      res.status(500).json({ error: "Error reading students file" });
      return;
    }

    const students = JSON.parse(data);
    const student = students.find((student) => student.id === studentId);

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  });
});

// Add Student endpoint
app.post("/students", (req, res) => {
  fs.readFile(studentsPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file: ", err);
      res.status(500).json({ error: "Error reading students file" });
      return;
    }

    const students = JSON.parse(data);
    const newStudent = {
      id: req.body.id,
      name: req.body.name,
      surname: req.body.surname,
      age: req.body.age,
    };

    students.push(newStudent);

    fs.writeFile(
      studentsPath,
      JSON.stringify(students, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing file: ", err);
          res.status(500).json({ error: "Error writing students file" });
          return;
        }

        res.json(newStudent);
      }
    );
  });
});

// Delete Student endpoint
app.delete("/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id);

  fs.readFile(studentsPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file: ", err);
      res.status(500).json({ error: "Error reading students file" });
      return;
    }

    let students = JSON.parse(data);
    const initialLength = students.length;
    students = students.filter((student) => student.id !== studentId);

    if (students.length < initialLength) {
      fs.writeFile(
        studentsPath,
        JSON.stringify(students, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing file: ", err);
            res.status(500).json({ error: "Error writing students file" });
            return;
          }

          res.json({ message: "Student deleted successfully" });
        }
      );
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
