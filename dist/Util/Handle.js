import { createSpinner } from "nanospinner";
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
export async function handleAnswer(isCorrect, anwser) {
    const spinner = createSpinner('Checking answer..').start();
    await sleep();
    if (isCorrect) {
        spinner.success({ text: `${anwser}` });
    }
    else {
        spinner.error({ text: `${anwser}` });
        process.exit(1);
    }
}
