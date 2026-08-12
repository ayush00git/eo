const crudRepositories = require('./crudRepositories');
const {Hall} = require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

class HallRepository extends crudRepositories {
    constructor() {
        super(Hall);
    }
    async getById(id) {//to be fix
        try {
            console.log("id",id);
            const hall = await this.model.findOne({_id:id});
            console.log(hall);
            return hall;
        } catch (error) {
            return new AppError("Error while fetching hall", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = HallRepository;