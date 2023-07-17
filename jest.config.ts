module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['./tests/jest.setup.ts'],
    moduleNameMapper: {
        '^@Config/(.*)$': '<rootDir>/src/config/$1',
        '^@Entity/(.*)$': '<rootDir>/src/entity/$1',
        '^@Controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@Middleware/(.*)$': '<rootDir>/src/middleware/$1',
        '^@Repository/(.*)$': '<rootDir>/src/repository/$1',
        '^@Services/(.*)$': '<rootDir>/src/services/$1',
        '^@Utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@Helpers/(.*)$': '<rootDir>/src/helpers/$1',
        '^@Errors/(.*)$': '<rootDir>/src/errors/$1',
        '^@Test/(.*)$': '<rootDir>/test/$1'
    }
};