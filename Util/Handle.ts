import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation"
import figlet from "figlet";
import { createSpinner } from "nanospinner";

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

export async function handleAnswer(isCorrect: boolean, answer: string) {
    const spinner = createSpinner('Checking answer..').start();
    await sleep();

    if (isCorrect) {
      spinner.success({ text: chalk.green(answer) });
      // return true;
  } else {
      spinner.error({ text: chalk.red(answer) });
      // return false;
      process.exit(1)
    }
} 