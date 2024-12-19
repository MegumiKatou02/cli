import qrcode from 'qrcode';
import readline from 'readline';
import { handleAnswer } from '../Util/Handle.js';
async function generateQRCode(text) {
    try {
        await qrcode.toFile('qrcode.png', text);
        return handleAnswer(true, "QR code has been generated and saved at qrcode.png", "");
        // console.log('Mã QR đã được tạo và lưu tại qrcode.png');
    }
    catch (error) {
        return handleAnswer(false, "", "Error generating QR code");
        // console.error('Lỗi khi tạo mã QR:', error);
    }
}
export function qrCommand() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Confirm QR code generation? (Y/N): ', (action) => {
        if (action === 'Y' || action === 'y') {
            rl.question('Enter the text or URL you want to generate the QR code for: ', (text) => {
                generateQRCode(text);
                rl.close();
            });
        }
        else if (action === 'N' || action === 'n') {
            return handleAnswer(false, "", "Cancel QR code generation");
            // console.log('Quá trình tạo mã QR đã bị hủy.');
            rl.close();
        }
        else {
            console.log('Invalid selection');
            rl.close();
        }
    });
}
