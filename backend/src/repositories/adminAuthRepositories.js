const crudRepositories = require('./crudRepositories');
const {Admin} = require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');


class AdminAuthRepository extends crudRepositories {
    constructor() {
        super(Admin);
    }
    async getAdminByEmail(email) {
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

module.exports = AdminAuthRepository;