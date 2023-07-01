const inquirer = require('inquirer')
const fs = require('fs')
inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your project name?',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Write a description for your repo!',
    },
    {
      type: 'input',
      name: 'installation',
      message: 'Provide installation instructions if necessary.',
    },
    {
      type: 'input',
      name: 'usage',
      message: 'Tell people how to use your project!',
    },
    {
      type: 'input',
      name: 'contribution',
      message: 'Tell people how they can contribute.',
    },
    {
      type: 'input',
      name: 'testing',
      message: 'Instruct users on how to test your project.',
    },
    {
      type: 'input',
      name: 'questions',
      message: 'Provide a FAQ section for your users.',
    },
    {
      type: 'checkbox',
      message: 'What is your preferred method of communication?',
      name: 'license',
      choices: ['MIT', 'GNU', 'wtfpl'],
    },
  ])
  .then((data) => {
    const filename = `${data.name.toLowerCase().split(' ').join('')}.json`;
    const title = `#${data.name}`;
    const file = `${title}\n##Description\n\n${data.description}\n\n##Table of Contents\n\n- [Usage](#usage)\n- [Credits](#credits)\n- [License](#license)\n- [Features](#features)\n\n#Installation\n\n${data.installation}\n\n#Usage\n\n${data.usage}\n\n#Contribution\n\n${data.contribution}\n\n#Testing\n\n${data.testing}\n\n#Questions\n\n${data.questions}\n\n#License\n\n${data.license}\n\n`.trim();
    console.log(file);
    fs.writeFile(filename, JSON.stringify(data, null, '\t'), (err) =>
      err ? console.log(err) : console.log('Success!')
    );
  });