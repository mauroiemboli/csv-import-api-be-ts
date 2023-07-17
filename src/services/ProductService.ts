import { QueryRunner } from 'typeorm';
import { Product } from '@Entity/Product';
import { dataSource } from '@Config/database';
import { getUserSocket } from '@Config/socket';
import CSVHelper from '@Helpers/CSVHelper';
import { ProductRepository } from '@Repository/ProductRepository';

class ProductService {
    progressMap = new Map<string, number>();

    async findAll(): Promise<Product[]> {
        const products = await ProductRepository.find(({}));
        if (products.length === 0) {
            return [];
        }
        return products;
    }

    private async processRow(row: any, queryRunner: QueryRunner, rowCount?: number, totalRow?: number, userId?: string) {
        const errors = [];
        let created = 0;
        let updated = 0;

        // Calculate progress 
        if (rowCount && totalRow && userId) {

            const progress = (rowCount / totalRow) * 100;

            this.progressMap.set(userId, progress);

            const socket = getUserSocket(userId);

            if (socket) {
                socket.emit('progress', { userId, progress });
            }
        }

        const productRepository = queryRunner.manager.getRepository(Product);

        const price = Number(row.price.replace(",", "."));
        // check for missing or malformed data
        if (!row.name || !row.price || isNaN(price)) {
            console.log('malformed case', row)
            const errorString = `Invalid row: "id:" ${row.id} | "name: ${row.name} | price: ${row.price} \n`;
            errors.push(errorString);
        } else {
            if (!row.id) {
                // id is missing, create a new product
                console.log('id is missing', row)
                const newProduct = productRepository.create({ name: row.name, price: price });
                await productRepository.save(newProduct);
                created += 1;
            } else {
                // id is ok,  update existing product
                const existingProduct = await productRepository.findOne({ where: { id: row.id } });
                if (existingProduct) {
                    existingProduct.name = row.name;
                    existingProduct.price = price;
                    await productRepository.save(existingProduct);
                    updated += 1;
                } else {
                    // If product with such id doent't exist create a new one
                    console.log('id is ok, product not exists', row)
                    const newProduct = productRepository.create({ id: Number(row.id), name: row.name, price: price });
                    await productRepository.save(newProduct);
                    created += 1;
                }
            }
        }


        return { created, updated, errors };
    }

    async processFileWPromis(file: Express.Multer.File | undefined, userId: string) {
        const validatedFile = CSVHelper.validateFile(file);
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        let createdCount = 0;
        let updatedCount = 0;
        let totalRow = 0;
        let errors: string[] = [];

        if (file) totalRow = await CSVHelper.countRows(file);

        try {
            let rowCount = 0;
            let rowPromises: any[] = [];

            await CSVHelper.parseCsv(validatedFile, (row) => {
                rowCount++;

                const rowPromise = this.processRow(row, queryRunner, rowCount, totalRow, userId).then(result => {
                    createdCount += result.created;
                    updatedCount += result.updated;
                    errors = [...errors, ...result.errors];
                });

                rowPromises.push(rowPromise);

                return rowPromise;
            });

            await Promise.all(rowPromises);

            // Commit the transaction
            await queryRunner.commitTransaction();

            this.progressMap.delete(userId); // Clear the progress map for this user

            return { createdCount, updatedCount, errors };
        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            this.progressMap.delete(userId); // Clear the progress map for this user
            throw error;
        } finally {
            await queryRunner.release();
        }
    }



    async processFile(file: Express.Multer.File | undefined, userId: string) {

        const validatedFile = CSVHelper.validateFile(file);
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.startTransaction();


        let createdCount = 0;
        let updatedCount = 0;
        let totalRow = 0;
        let errors: string[] = [];

        if (file) totalRow = await CSVHelper.countRows(file);

        try {
            let rowCount = 0;

            await CSVHelper.parseCsv(validatedFile, async (row) => {
                rowCount++;
                const result = await this.processRow(row, queryRunner, rowCount);


                createdCount += result.created;
                updatedCount += result.updated;
                errors = [...errors, ...result.errors];

                // Calculate progress 
                const progress = (rowCount / totalRow) * 100;
                this.progressMap.set(userId, progress);

                const socket = getUserSocket(userId);

                if (socket) {
                    socket.emit('progress', { userId, progress });
                }
            });

            // Commit the transaction
            await queryRunner.commitTransaction();

            this.progressMap.delete(userId); // Clear the progress map for this user

            return { createdCount, updatedCount, errors };
        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            this.progressMap.delete(userId); // Clear the progress map for this user
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

}

export default new ProductService();