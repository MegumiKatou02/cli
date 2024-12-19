import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation"
import figlet from "figlet";
import { createSpinner } from "nanospinner";

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

export async function handleAnswer(isCorrect: boolean, ifTrue: string, ifFalse: string) {
    const spinner = createSpinner('Checking answer..').start();
    await sleep();

    if(isCorrect) {
        spinner.success({ text: `${ifTrue}`});
    }
    else {
        spinner.error({ text: `${ifFalse}`});
        process.exit(1);
    }
} 