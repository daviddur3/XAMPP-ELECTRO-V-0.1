module.exports = {
    // Ambiente de pruebas
    testEnvironment: 'node',

    // Directorios de pruebas
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/**/*.spec.js'
    ],

    // Configuración de cobertura
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 80,
            lines: 80,
            statements: -10
        }
    },

    // Configuraciones adicionales
    verbose: true,
    bail: 1,
    maxWorkers: '50%',

    // Módulos a ignorar
    modulePathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/'
    ],

    // Transformaciones
    transform: {
        '^.+\\.js$': 'babel-jest'
    }
};
