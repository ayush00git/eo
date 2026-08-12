const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const { HallService } = require("../services");

async function addHall(req,res) {
    const data={
        name:req.body.name,
        capacity:req.body.capacity,
        image:req.body.image,
        location:req.body.location,
        description:req.body.description
    }
    try {
        const hall = await HallService.createHall(data);
        SuccessResponse.data = hall;
        SuccessResponse.message = "Hall added successfully";
        res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while adding hall";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}




async function getHall(req,res) {
    try {
        const hall = await HallService.getHall();
        SuccessResponse.data = hall;
        SuccessResponse.message = "Hall fetched successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while fetching hall";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getHallById(req,res) {
    const id = req.params.id;
    try {
        const hall = await HallService.getHallById(id);
        SuccessResponse.data = hall;
        SuccessResponse.message = "Hall fetched successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while fetching hall";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function updateHall(req,res) {
    const id = req.params.id;
    const data={
        name:req.body.name,
        capacity:req.body.capacity,
        image:req.body.image,
        location:req.body.location,
        description:req.body.description
    }
    try {
        
        
        
        data.capacity = parseInt(data.capacity);
        console.log(req.params);
        
        const hall = await HallService.updateHall(id,data);
        SuccessResponse.data = hall;
        SuccessResponse.message = "Hall updated successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while updating hall";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}
async function deleteHall(req,res) {
    const id = req.params.id;
    try {
        const hall = await HallService.deleteHall(id);
        SuccessResponse.data = hall;
        SuccessResponse.message = "Hall deleted successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while deleting hall";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = { 
    addHall,
    getHall,
    getHallById,
    updateHall,
    deleteHall
 };