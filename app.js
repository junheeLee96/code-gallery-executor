const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/execute", (req, res) => {
  console.log("execute");
  const { language, code } = req.body;

  let command;
  switch (language) {
    case "python":
      command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
      break;
    case "java":
      command = `echo '${code}' > Test.java && javac Test.java && java Test`;
      break;
    case "javascript":
      command = `node -e "${code.replace(/"/g, '\\"')}"`;
      break;
    case "go":
      command = `echo '${code}' > test.go && go run test.go`;
      break;
    default:
      return res.status(400).send("Unsupported language");
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log("error = ", error);
      return res.status(500).json({ error: stderr });
    }
    res.json({ output: stdout });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
