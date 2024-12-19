import { createSpinner } from "nanospinner";
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
export async function handleAnswer(isCorrect, ifTrue, ifFalse) {
    const spinner = createSpinner('Checking answer..').start();
    await sleep();
    if (isCorrect) {
        spinner.success({ text: `${ifTrue}` });
    }
    else {
        spinner.error({ text: `${ifFalse}` });
        process.exit(1);
    }
}
