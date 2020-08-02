const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// The first questions when the prompt is started in node to add employees and roles

let employeeArray = [];

function start() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'question',
            message: 'Do you want to add a new Employee?',
            choices: ['Add Employee', 'Done']
        })

        .then(function (answer) {
            if (answer.question === 'Add Employee') {
                renderQuestions();
            }
            else {
                generateHTML();
            }
        })
}

// If user wants to add emplyees they are presented with these prompts
function renderQuestions() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Employee name:'
        },
        {
            type: 'input',
            name: 'email',
            message: 'Employee email:'
        },
        {
            type: 'input',
            name: 'id',
            message: 'Employee ID:'
        },
        {
            type: 'list',
            name: 'role',
            message: 'Employee role:',
            choices: ['Engineer', 'Intern', 'Manager']
        }
    ])

        // Once the role is selected the user is presented with prompts for the specific role
        .then(function (answers) {
            if (answers.role === 'Engineer') {
                inquirer.prompt(
                    {
                        type: 'input',
                        name: 'github',
                        message: 'Employee GitHub username:'
                    })

                    .then(function (engineerPrompt) {
                        const engineer = new Engineer(answers.name, answers.id, answers.email, engineerPrompt.github);
                        employeeArray.push(engineer);
                        start();
                    })
            }

            else if (answers.role === 'Intern') {
                inquirer.prompt(
                    {
                        type: 'input',
                        name: 'school',
                        message: 'Intern School attending:'
                    })
                    .then(function (internPrompt) {
                        const intern = new Intern(answers.name, answers.id, answers.email, internPrompt.school);
                        employeeArray.push(intern);
                        start();
                    })
            }

            else if (answers.role === 'Manager') {
                inquirer.prompt(
                    {
                        type: 'input',
                        name: 'officenumber',
                        message: 'Office Number:'
                    })
                    .then(function (managerPrompt) {
                        const manager = new Manager(answers.name, answers.id, answers.email, managerPrompt.officenumber);
                        employeeArray.push(manager);
                        start();
                    })
            }
        });
}

// When the user is done adding employees and selects done, an html file is generated showing all added employees,
//their roles, and other information from the prompts
function generateHTML() {
    fs.writeFile(outputPath, render(employeeArray), function (err) {
        if (err) throw err;
        console.log('Done');
    })
}

// starts the application when node app.js is typed in the terminal
start()

