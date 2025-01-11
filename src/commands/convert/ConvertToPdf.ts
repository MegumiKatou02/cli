import { Command } from 'commander';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
import { CLOUD_CONVERT_API } from '../../constants/Config.js';

export const convertToPdfCommand = new Command('to-pdf')
  .description('Convert a file to PDF using CloudConvert API')
  .argument('<inputFile>', 'Path to the input file')
  .argument('<outputFile>', 'Path to the output PDF file')
  .action(async (inputFile, outputFile) => {
    const inputPath = path.resolve(inputFile);
    const outputPath = path.resolve(outputFile);

    if (!fs.existsSync(inputPath)) {
      console.error('Input file does not exist.');
      process.exit(1);
    }

    const apiKey = CLOUD_CONVERT_API;
    const apiUrl = 'https://api.cloudconvert.com/v2/convert';

    const formData = new FormData();
    formData.append('file', fs.createReadStream(inputPath));

    try {
      const uploadResponse = await axios.post('https://api.cloudconvert.com/v2/import/upload', formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      const taskId = uploadResponse.data.data.id;

      const convertResponse = await axios.post(apiUrl, {
        input: taskId,
        output_format: 'pdf',
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      const convertTaskId = convertResponse.data.data.id;

      let taskStatus = 'waiting';
      let taskStatusResponse = null; 

      while (taskStatus !== 'finished' && taskStatus !== 'error') {
        await new Promise(resolve => setTimeout(resolve, 5000));
        taskStatusResponse = await axios.get(`https://api.cloudconvert.com/v2/tasks/${convertTaskId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        taskStatus = taskStatusResponse.data.data.status;
        console.log(`Current task status: ${taskStatus}`);
      }

      if (taskStatus === 'error') {
        console.error('Conversion task failed.');
        process.exit(1);
      }

      if (!taskStatusResponse) {
        console.error('Task status response is missing.');
        process.exit(1);
      }

      const pdfUrl = taskStatusResponse.data.data.result.files[0].url;
      if (!pdfUrl) {
        console.error('PDF URL is missing in the response.');
        process.exit(1);
      }

      const pdfResponse = await axios.get(pdfUrl, { responseType: 'stream' });

      const writer = fs.createWriteStream(outputPath);
      pdfResponse.data.pipe(writer);

      writer.on('finish', () => {
        console.log(`File converted successfully: ${outputPath}`);
      });

      writer.on('error', (err) => {
        console.error('Error saving PDF file:', err);
      });
    } catch (err: any) {
      if (err.response) {
        console.error('Server error:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error:', err.message);
      }
    }
  });