const crudRepository = require('./crudRepositories');
const {User} = require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

class AuthRepository extends crudRepository {
    constructor() {
        super(User);
    }
    async findUserByEmail(email) {
        try {
            return await this.model.findOne({ email });
        } catch (err) {
            throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    async findUserById(id) {
        try {
            return await this.model.findById(id);
        } catch (err) {
            throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    
    
}

module.exports = AuthRepository;