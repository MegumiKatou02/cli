import { pastel } from "gradient-string";
import figlet from "figlet";
export function welcome() {
    console.clear();
    const msg = `Thank you for using my CLI
                      - Haiku Team -`;
    figlet(msg ?? '', (err, data) => {
        if (data === undefined) {
            console.log(pastel.multiline('test'));
        }
        else {
            console.log(pastel.multiline(data));
        }
    });
}
