const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const jest = require("jest");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

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
        .then(function (answers) {
            if (answers.job === 'Engineer') {
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
            else if (answers.job === 'Intern') {
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

            else if (answers.job === 'Manager') {
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
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

function generateHTML() {
    fs.writeFile(outputPath, render(employeeArray), function (err) {
        if (err) throw err;
        console.log('Done');
    })
}

start()

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
