import { AppError } from "@Errors/AppError";


class AuthenticationHelper {

    validatePassword(password: string) {
        // Require at least one uppercase letter, one lowercase letter, one number, and one special character
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (regex.test(password)) {
            return true;
        } return false;
    }

}

export default new AuthenticationHelper();
