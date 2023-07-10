//Import the required packages, inquirer for prompting the user for data, and fs for controlling the file system in order to write and save the data to a local file.
const inquirer = require('inquirer');
const fs = require('fs');
//Define the license text for each option.
const licenses = {
  MIT: {
    badge: "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)",
    text: `MIT License

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`,
  },
  GNU: {
    badge: "[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)",
    text: `GNU General Public License (GPL) version 3

    This is a free software license, compatible with version 3 of the GNU General Public License (GPL).

    For more information about this license, please visit the [GNU website](https://www.gnu.org/licenses/gpl-3.0).`,
  },
  wtfpl: {
    badge: "[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-brightgreen.svg)](http://www.wtfpl.net/)",
    text: `WTFPL – Do What the F*ck You Want to Public License

    This is a permissive license that allows you to do whatever you want with the code, without any restrictions.

    For more information about this license, please visit the [WTFPL website](http://www.wtfpl.net/).`,
  },
  Apache: {
    badge: "[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)",
    text: `Apache License 2.0

    This is a permissive open-source license that allows you to use, copy, modify, distribute, and sublicense the code.

    For more information about this license, please visit the [Apache website](https://opensource.org/licenses/Apache-2.0).`,
  },
  ISC: {
    badge: "[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)",
    text: `ISC License

    This is a permissive open-source license that allows you to use, copy, modify, and distribute the code, with or without modifications.

    For more information about this license, please visit the [ISC website](https://opensource.org/licenses/ISC).`,
  },
  MPL: {
    badge: "[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)",
    text: `Mozilla Public License 2.0

    This is a copyleft license that allows you to use, modify, distribute, and sublicense the code, as long as any modifications are made available under the same license.

    For more information about this license, please visit the [Mozilla website](https://opensource.org/licenses/MPL-2.0).`,
  },
  BSD: {
    badge: "[![License: BSD 3-Clause](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)",
    text: `BSD 3-Clause License

    This is a permissive open-source license that allows you to use, modify, distribute, and sublicense the code.

    For more information about this license, please visit the [BSD website](https://opensource.org/licenses/BSD-3-Clause).`,
  },
  Unlicense: {
    badge: "[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)",
    text: `The Unlicense

    This is a public domain dedication that allows you to use the code without any restrictions.

    For more information about this license, please visit the [Unlicense website](http://unlicense.org/).`,
  },
};
//Here is a helper function that capitalizes an input string. This way we can use the key as the header info and just pass it through here to capitalize.
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
//This object does most of the work, generating the content of the page once all of the data has been collected.
function objToString(obj) {
  //It iterates over every entry and if it matches one of the cases below, handles it specially, but otherwise just creates header and content from key and value.
  var content = Object.entries(obj).reduce((str, [p, val]) => {
    //If there is no data (i.e. the user has pressed enter to skip the section) then it returns nothing and omits the section.
    if (val == "") { return str }
    //If the key is the name, we generate the first section seperately from the content.
    if (p === "name") {
      //First we set the license badge from the selected license
      const licenseBadge = licenses[obj.license[0]].badge;
      //Then we return the main header title, generate the table of contents from the object and append that and the license badge to the end of the title, with some spacing to make it look nice.
      return `# ${capitalizeFirstLetter(val)}\n\n${generateTableOfContents(obj)}\n\n${licenseBadge}\n\n`;
    }
    //If the key is github or the email, return the value with the formatted text.
    if (p === "github" && val) {
      return `${str}\n- GitHub Profile: [${val}](https://github.com/${val})\n\n`;
    }
    if (p === "email" && val) {
      return `${str}- For additional questions, reach out to ${val}.\n\n`;
    }
    //If the key is questions, format the value and key as header and content text and return it.
    if (p === "questions") {
      return `${str}\n\## ${capitalizeFirstLetter(p)}\n\nFAQ:\n${val}\n\n`;
    }
    if (p === "contact") {
      const contactValue = val.map(item => item === "Github" ? "Preferred method of communication: Github" : "Preferred method of communication: Email");
      return `${str}## Contact\n\n${contactValue.join('\n')}\n\n`;
    }
    //If the key is the license, get the content from the licenses object and format the section's header and text to append.
    if (p === "license") {
      const licenseText = licenses[val[0]].text.replace(/^\s+|\s+$/g, "");
      return `${str}\n\n## License\n\n${licenseText}\n\n`;
    }
    //If none of these cases apply, simply return the key capitalized as the header and the value of the key formatted into a section to append.
    return `${str}## ${capitalizeFirstLetter(p)}\n${val}\n\n`;
  }, '');
  //When all iteration is done, return the resulting content.
  return content;
}
//This function generates a table of contents from the inquirer's returned data. If the value is empty meaning the user has skipped, or the key is either name, github or email, skip adding it to the table of contents.
function generateTableOfContents(obj) {
  var table = Object.entries(obj).reduce((str, [p, val]) => {
    if (val == "" || p === "name" || p === "github" || p === "email") { return str }
    return `${str} - [${capitalizeFirstLetter(p)}](#${p.toLowerCase()})\n`;
  }, '');
  return "## Table of Contents\n" + table;
}
//Here is the structure of the prompts, and all the questions that make up the data for the README. Each question has a type of prompt, a variable name that gets assigned to each answer as its key, and the
//string that we are prompting the user with for each section.
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
      name: 'contributing',
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
      type: 'input',
      name: 'github',
      message: 'Enter your GitHub username:',
    },
    {
      type: 'input',
      name: 'email',
      message: 'Enter your email address:',
    },
    {
      type: 'checkbox',
      message: 'What is your preferred method of communication?',
      name: 'contact',
      choices: ['Github', 'Email'],
    },
    {
      type: 'checkbox',
      message: 'What license does your project use?',
      name: 'license',
      choices: ['MIT', 'GNU', 'wtfpl', 'Apache', 'ISC', 'MPL', 'BSD', 'Unlicense'],
    },
  ])
  //Finally, once the prompts have all been answered and the promise fulfilled, we create the filepath and name, the data to print using our objToString function, and write it to our filepath.
  .then((data) => {
    const filename = `output\\README.md`;
    const fileData = objToString(data);
    fs.writeFile(filename, fileData, (err) =>
      err ? console.log(err) : console.log('Success!')
    );
  });
