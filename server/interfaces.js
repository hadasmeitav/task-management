const Routes = {
    register: '/register',
    login: '/login',
    token: '/token',
    tasks: '/tasks'
}

const Messages = {
    userNameAlreadyExists: "Username already exists",
    userRegisteredSuccessfully: 'User registered successfully',
    invalidCredentials: 'Invalid credentials',
    invalidToken: 'Invalid token',
    accessDenied: 'Access denied',
    taskNotFound: 'Task id not found',
    taskRemoved: 'Task was removed'
};

module.exports = { Routes, Messages };