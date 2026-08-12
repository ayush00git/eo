const {AudiHelperRepositories} = require('../repositories');
const {ErrorResponse} = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const {StatusCodes}=require('http-status-codes');
const AudiHelperRepo=new AudiHelperRepositories();

async function addHelper(data) {
    try {
        const response=await AudiHelperRepo.create(data);
        return response;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while adding helper",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllHelper() {
    try {
        const response=await AudiHelperRepo.getAll();
        return response;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while getting helper",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateHelper(id,data) {
    try {
        const response=await AudiHelperRepo.update(id,data);
        return response;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while updating helper",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getHelper(id) {
    try {
        const response=await AudiHelperRepo.get(id);
        return response;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while getting helper",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteHelper(id) {
    try {
        const response=await AudiHelperRepo.destroy(id);
        return response;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while deleting helper",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports={
    addHelper,
    getAllHelper,
    updateHelper,
    getHelper,
    deleteHelper
}