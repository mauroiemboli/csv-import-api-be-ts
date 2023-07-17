import { AppError } from '@Errors/AppError';
import csvParse from 'csv-parser';
import fs from 'fs';

class CSVHelper {

    validateFile(file: Express.Multer.File | undefined): Express.Multer.File {
        if (!file) {
            throw new AppError('File not uploaded correctly');
        }

        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 25) {
            throw new AppError('File size limit exceeded (25MB)');
        }

        if (file.mimetype !== 'text/csv') {
            throw new AppError('Invalid file type. Only CSV files are allowed.');
        }
        return file;
    }

    async countRows(file: Express.Multer.File): Promise<number> {
        let rowCount = 0;
        return new Promise((resolve, reject) => {
            fs.createReadStream(file.path)
                .pipe(csvParse())
                .on('data', () => rowCount++)
                .on('end', () => resolve(rowCount))
                .on('error', reject);
        });
    }


    async parseCsv(file: Express.Multer.File, handleRow: (row: any) => Promise<void>) {
        let rowCount = 0;
        const maxRowCount = 100000; // Maximum row count

        const stream = fs.createReadStream(file.path);

        return new Promise((resolve, reject) => {
            stream.pipe(csvParse())
                .on('data', async (row) => {

                    stream.pause();
                    try {
                        if (!this.validateRowStructure(row)) {
                            reject(new AppError('Invalid row. Each row should have id, name and price. Process stop at row n: ' + rowCount));
                            return;
                        }
                        if (rowCount >= maxRowCount) {
                            reject(new AppError('The CSV file should not contain more than 100,000 rows.'));
                            return;
                        }
                        rowCount++;

                        await handleRow(row);

                        stream.resume();
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });
    }

    private validateRowStructure(row: any): boolean {
        // Check if the row has the id, name, and price properties
        return row.hasOwnProperty('id') && row.hasOwnProperty('name') && row.hasOwnProperty('price');
    }


}

export default new CSVHelper();
