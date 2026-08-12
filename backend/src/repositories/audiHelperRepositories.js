const {AudiHelper}=require('../models');
const crudRepositories = require('./crudRepositories');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

class AudiHelperRepositories extends crudRepositories{
    constructor(){
        super(AudiHelper);
    }
}

module.exports=AudiHelperRepositories;