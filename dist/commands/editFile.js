import readlineSync from "readline-sync";
import { handleAnswer } from "../Util/Handle.js";
// Chỉnh sửa file
export async function editFile(content) {
    let editing = true;
    while (editing) {
        const action = readlineSync.question("Choose action (add/edit/delete/save/exit): ");
        switch (action) {
            case "add":
                const newLine = readlineSync.question("Add line: ");
                content.push(newLine);
                break;
            case "edit":
                const editLine = parseInt(readlineSync.question("Line number to edit: ")) - 1;
                if (editLine >= 0 && editLine < content.length) {
                    content[editLine] = readlineSync.question("New content: ");
                }
                else {
                    // console.log("Invalid line number");
                    await handleAnswer(false, "Invalid line number");
                }
                break;
            case "delete":
                const deleteLine = parseInt(readlineSync.question("Line number to delete: ")) - 1;
                if (deleteLine >= 0 && deleteLine < content.length) {
                    content.splice(deleteLine, 1);
                }
                else {
                    await handleAnswer(false, "Invalid line number");
                }
                break;
            case "save":
                return content;
            case "exit":
                editing = false;
                break;
            default:
                console.log("Invalid action");
        }
    }
    return content;
}
