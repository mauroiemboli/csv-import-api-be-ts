import { dataSource } from "@Config/database";
import { Product } from "@Entity/Product";

export const ProductRepository = dataSource.getRepository(Product).extend({
    async findByEmail(email: string) {
        return this.createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getMany()
    },


})

