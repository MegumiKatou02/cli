import chalk from "chalk";
import inquirer from "inquirer";
import { pastel } from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

export function welcome() {
    console.clear();
    const msg: string = `Thank you for using my CLI
                      - Haiku Team -`;
    figlet(msg ?? '', (err, data) => {
        if (err || !data) {
            console.log(pastel.multiline('Thank you for using my CLI\n- Haiku Team -'));
            return;
        }
        if (data === undefined) {
            console.log(pastel.multiline('test'));
        } else {
            console.log(pastel.multiline(data));
        }
        const rainbowTitle = chalkAnimation.rainbow("\nInitializing CLI...\n");
        setTimeout(() => {
            rainbowTitle.stop();
        }, 2000);
    });
}