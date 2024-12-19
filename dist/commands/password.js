import inquirer from "inquirer";
export function generatePassword(length, useUpper, useLower, useNumbers, useSymbols) {
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";
    let validChars = "";
    if (useUpper)
        validChars += upperCase;
    if (useLower)
        validChars += lowerCase;
    if (useNumbers)
        validChars += numbers;
    if (useSymbols)
        validChars += symbols;
    if (!validChars) {
        console.error("You must select at least one option to create a password.!");
        process.exit(1);
    }
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * validChars.length);
        password += validChars[randomIndex];
    }
    return password;
}
export async function Option() {
    const answers = await inquirer.prompt([
        {
            name: "length",
            type: "input",
            message: "What is the length of the password you want??",
            validate: (input) => {
                const parsed = parseInt(input, 10);
                return parsed > 0 ? true : "Length must be a number greater than 0!";
            },
        },
        {
            name: "options",
            type: "checkbox",
            message: "Select options included:",
            choices: [
                { name: "Uppercase (A-Z)", value: "upper" },
                { name: "Lowercase (a-z)", value: "lower" },
                { name: "Number (0-9)", value: "numbers" },
                { name: "Special characters (!@#$%^&*)", value: "symbols" },
            ],
        },
    ]);
    const length = parseInt(answers.length, 10);
    const useUpper = answers.options.includes("upper");
    const useLower = answers.options.includes("lower");
    const useNumbers = answers.options.includes("numbers");
    const useSymbols = answers.options.includes("symbols");
    const password = generatePassword(length, useUpper, useLower, useNumbers, useSymbols);
    console.log(`\nYour password is: ${password}`);
    // return password;
}
