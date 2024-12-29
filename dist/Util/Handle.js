import chalk from "chalk";
import { createSpinner } from "nanospinner";
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
export async function handleAnswer(isCorrect, answer) {
    const spinner = createSpinner('Checking answer..').start();
    await sleep();
    if (isCorrect) {
        spinner.success({ text: chalk.green(answer) });
        // return true;
    }
    else {
        spinner.error({ text: chalk.red(answer) });
        // return false;
        process.exit(1);
    }
}
