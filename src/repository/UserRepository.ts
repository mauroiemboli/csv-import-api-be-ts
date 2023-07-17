import { dataSource } from "@Config/database";
import { User } from "@Entity/User";

export const UserRepository = dataSource.getRepository(User).extend({
    async findByEmail(email: string) {
        return this.createQueryBuilder("user")
            .select(["user.id", "user.email", "user.firstName", "user.lastName", "user.username"]) // include other fields as needed
            .where("user.email = :email", { email })
            .getMany()
    },

    async userExists(email: string): Promise<Boolean> {
        const userList = await this.findByEmail(email);
        return userList.length > 0
    }
})

