const {ErrorResponse} = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { HallRepository } = require('../repositories');
const hallRepo = new HallRepository();


async function createHall(data) {
    try {
        const hall = await hallRepo.create(data);
        return hall;
    } catch (error) {
        return new AppError("Error while adding hall", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getHall() {
    try {
        const hall = await hallRepo.getAll();
        return hall;
    } catch (error) {
        return new AppError("Error while fetching hall", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getHallById(id) {
    try {
        const hall = await hallRepo.getById(id);
        if(!hall) {
            return new ErrorResponse("Hall not found", StatusCodes.NOT_FOUND);
        }
        return hall;
    } catch (error) {
        return new AppError("Error while fetching hall", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function updateHall(id, data) {
    try {
        const hall = await hallRepo.update(id, data);
        return hall;
    } catch (error) {
        return new AppError("Error while updating hall", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteHall(id) {
    try {
        const hall = await hallRepo.destroy(id);
        return hall;
    } catch (error) {
        return new AppError("Error while deleting hall", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = { 
    createHall,
    getHall,
    getHallById,
    updateHall,
    deleteHall
 };