const {StatusCodes}=require('http-status-codes');
const {AudiHelperService}=require('../services');
const {SuccessResponse,ErrorResponse}=require('../utils/common');
const { message } = require('../utils/common/success-response');


async function addHelper(req,res) {
    try {
        const data={
            name:req.body.name,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber,
            designation:req.body.designation,
            venue:req.body.venue
        }
        const response=await AudiHelperService.addHelper(data);
        SuccessResponse.response=response;
        SuccessResponse.message="Added Successfully";
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error=error.message;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}


async function updateHelper(req,res) {
    try {
        const id = req.params.id;
        const data={
            name:req.body.name,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber,
            designation:req.body.designation,
            venue:req.body.venue
        }
        const response=await AudiHelperService.updateHelper(id,data)
        SuccessResponse.data = response;
        SuccessResponse.message = "Helper updated successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error=error.message;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}

async function getAllHelper(req,res) {
    try {
        const response = await AudiHelperService.getAllHelper();
        SuccessResponse.data = response;
        SuccessResponse.message = "Helper fetched successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while fetching Helper";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}



async function getHelperById(req,res) {
    const id = req.params.id;
    try {
        const response = await AudiHelperService.getHelper(id);
        SuccessResponse.data = response;
        SuccessResponse.message = "Helper fetched successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while fetching Helper";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}



async function deleteHelper(req,res) {
    const id = req.params.id;
    try {
        const response = await AudiHelperService.deleteHelper(id);
        SuccessResponse.data = response;
        SuccessResponse.message = "Helper deleted successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while deleting helper";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports={
    addHelper,
    updateHelper,
    getAllHelper,
    getHelperById,
    deleteHelper
}