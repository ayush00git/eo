const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { BookingRepository, HallRepository,AudiHelperRepositories } = require('../repositories');
const bookingRepo = new BookingRepository();
const { mailSendApprovedSimple, mailsendRejectedconflicts, mailSendVictim, mailSendApprovedConflicts, mailsendRejected, mailtoStaff,mailBookkingNotificationToAdmin } = require('./mailerService')
const { AuthRepository } = require('../repositories');
const authRepo = new AuthRepository();
const hallrpo = new HallRepository();
const helperRepo = new AudiHelperRepositories();



async function createBooking(data) {
    try {
        const booking = await bookingRepo.create(data);
        if (!booking) {
            return new ErrorResponse("Booking not created", StatusCodes.BAD_REQUEST);
        }
        const user = await authRepo.findUserById(data.user);
        const venue = await hallrpo.getById(data.hall);
        mailBookkingNotificationToAdmin(user, booking,venue.name).then((response) => {
        }).catch((error) => {
        }
        );
        return booking;
    } catch (error) {
        return new AppError("Error while adding booking", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getBooking(filter = {}) {
    try {

        const booking = await bookingRepo.getAllbooking(filter);
        return booking;
    } catch (error) {
        return new AppError("Error while fetching booking", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getBookingById(id) {
    try {
        const booking = await bookingRepo.getById(id);
        if (!booking) {
            return new ErrorResponse("Booking not found", StatusCodes.NOT_FOUND);
        }
        return booking;
    } catch (error) {
        return new AppError("Error while fetching booking", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function getBookingByUser(id) {
    try {
        const booking = await bookingRepo.getByUser(id);
        return booking;
    } catch (error) {
        return new AppError("Error while fetching booking", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

function ApprovedBookingSimple(username, booking, venue, mesg) {
    return `Dear ${username},

    We are pleased to inform you that your booking request for ${venue} from 📅 ${booking.startDate}  ⏰ ${booking.startTime} to 📅 ${booking.endDate}  ⏰ ${booking.endTime} has been Approved.
    
    Please ensure that you follow all venue guidelines, including:
    
    📌Kindly Keeping the venue clean and returning it to its original state after use. 
    📌Adhering to the maximum occupancy limit as per regulations.
    📌Avoiding any activities that may cause disturbance or damage to the premises.
    ${mesg && `
    Message From Admin: ${mesg}
    `}
    If you have any special requirements or changes, kindly inform us at least 24 hours in advance.
                                                
    We appreciate your cooperation and look forward to a smooth event.
                                                
    Best Regards,
    Estate Officer
    NIT Hamirpur`
}
function ApprovedBookingConflicts(username, booking, venue, mesg, conflicts) {
    return `Dear ${username},

We are pleased to inform you that your booking request for ${venue} from 📅 ${booking.startDate}  ⏰ ${booking.startTime} to 📅 ${booking.endDate}  ⏰ ${booking.endTime} has been Approved.

However, we would like to bring to your attention that your booking has some conflicts with an existing reservation. While your request has been accommodated, we kindly ask you to coordinate if necessary to ensure a smooth experience for all parties involved.

Conflict Details:

${conflicts.map((conflict, index) => (
        `Conflict ${index + 1}:
    Title: ${conflict.title}
    Date & Time: 📅${conflict.startDate} ⏰${conflict.startTime} - 📅${conflict.endDate} ⏰${conflict.endTime}`
    )).join("\n")}

To ensure the best use of the venue, please adhere to the following guidelines:

📌 Keep the venue clean and return it to its original state after use.
📌 Adhere to the maximum occupancy limit as per regulations.
📌 Avoid any activities that may cause disturbance or damage to the premises.

${mesg && `Message From Admin: ${mesg}`}


If you have any concerns or require assistance in resolving the conflict, please reach out to us at your earliest convenience.

We appreciate your understanding and cooperation.

Best Regards,
Estate Officer
NIT Hamirpur`
}
function VictimMessage(username, booking, venue, mesg, conflict) {
    return `Dear ${username},

We hope you are doing well.

We would like to inform you that your previously approved booking for ${venue} from 📅 ${conflict.startDate}  ⏰ ${conflict.startTime} to 📅 ${conflict.endDate}  ⏰ ${conflict.endTime} now has a conflict with a newly accepted reservation.

While we strive to accommodate all requests fairly, this situation has created an overlap. We kindly request you to review your schedule and, if necessary, coordinate with the concerned party to resolve the conflict amicably.

Here is Datails of the conflict:
 ${booking.title}
 from 📅 ${booking.startDate}  ⏰ ${booking.startTime} to 📅 ${booking.endDate}  ⏰ ${booking.endTime}.
 Contact Details of the other party: ${booking.user.name} (${booking.user.email}).


To help maintain a smooth booking process, please ensure:

📌 The venue is used responsibly and left in its original condition.
📌 The maximum occupancy limits are followed.
📌 Any changes to your booking are communicated to us promptly.

${mesg && `Message From Admin: ${mesg}`}

If you need any assistance in addressing this issue, please feel free to contact us.

We appreciate your cooperation and understanding.

Best Regards,
Estate Officer
NIT Hamirpur`
}

function RejectedBookingconflicts(username, booking, venue, mesg, conflicts) {
    return `Dear ${username},

We regret to inform you that your booking request for ${venue} from 📅 ${booking.startDate}  ⏰ ${booking.startTime} to 📅 ${booking.endDate}  ⏰ ${booking.endTime} has been rejected due to scheduling conflicts with an existing approved reservation.

While we strive to accommodate all requests fairly, the requested slot is unavailable as it overlaps with another confirmed booking.

Conflict Details:

${conflicts.map((conflict, index) => (
        `Conflict ${index + 1}:
    Title: ${conflict.title}
    Date & Time: 📅${conflict.startDate} ⏰${conflict.startTime} - 📅${conflict.endDate} ⏰${conflict.endTime}`
    )).join("\n")}


If your schedule is flexible, we encourage you to check for alternative time slots and submit a new request accordingly.

${mesg ? `Message From Admin: ${mesg} ` : ""}

We appreciate your understanding and apologize for any inconvenience caused. If you need any assistance, feel free to reach out.

Best Regards,
Estate Officer
NIT Hamirpur`
}

function RejectedBooking(username, booking, venue, mesg) {
    return `Dear ${username},

We regret to inform you that your booking request for ${venue} from 📅 ${booking.startDate}  ⏰ ${booking.startTime} to 📅 ${booking.endDate}  ⏰ ${booking.endTime} has been rejected due to the following reason:

📌 Reason: ${mesg}

While we strive to accommodate all requests fairly, we were unable to approve your booking at this time.

If you have any concerns or wish to submit a new request with an alternative schedule, please feel free to reach out to us.

We appreciate your understanding and apologize for any inconvenience caused.

Best Regards,
Estate Officer
NIT Hamirpur`
}
async function updateBookingStatus(id, data) {
    try {
        const booking = await bookingRepo.getById(id);

        if (!booking) {
            return new ErrorResponse("Booking not found", StatusCodes.NOT_FOUND);
        }
        if (data.status === "approved") {

            const venue = await hallrpo.getById(booking.hall);
            const staff = await helperRepo.getAll({venue: venue._id});
            staff.forEach(async (staff) => {

            mailtoStaff(staff, booking,venue.name).then((response) => {
            }
            ).catch((error) => {
            });
            });

            if (data.conflicts.length > 0) {

                const message = ApprovedBookingConflicts(booking.user.name, booking, venue.name, data.messFromAdmin, data.conflicts)
                const response = await bookingRepo.update(id, { status: "approved", messFromAdmin: message });
                mailSendApprovedConflicts(booking.user, booking, venue.name, data.messFromAdmin, data.conflicts).then((response) => {
                }
                ).catch((error) => {
                });

                data.conflicts.forEach(async (conflict) => {
                    const victim = conflict.user;
                    const message = VictimMessage(victim.name, booking, venue.name, data.messFromAdmin, conflict)
                    bookingRepo.update(conflict._id, { status: "approved", messFromAdmin: message });
                    mailSendVictim(victim, booking, venue.name, conflict).then((response) => {
                    }
                    ).catch((error) => {
                    });
                });

                return response;

            }
            else {

                

                const message = ApprovedBookingSimple(booking.user.name, booking, venue.name, data.messFromAdmin)
                const response = await bookingRepo.update(id, { status: "approved", messFromAdmin: message });



                mailSendApprovedSimple(booking.user, booking, venue.name, data.messFromAdmin).then((response) => {
                }
                ).catch((error) => {
                });
                return response;
            }
        }

        if (data.status === "cancelled") {
            const response = await bookingRepo.update(id, { status: "cancelled" });
            return response;
        }
        if (data.status === "rejected") {
            if (data.conflicts.length > 0) {
                const venue = await hallrpo.getById(booking.hall);
                const message = RejectedBookingconflicts(booking.user.name, booking, venue.name, data.messFromAdmin, data.conflicts)
                const response = await bookingRepo.update(id, { status: "rejected", messFromAdmin: message });
                mailsendRejectedconflicts(booking.user, booking, venue.name, data.conflicts,data.messFromAdmin).then((response) => {
                }
                ).catch((error) => {
                });

                return response;
            }
            else{
                const venue = await hallrpo.getById(booking.hall);
                const message = RejectedBooking(booking.user.name, booking, venue.name, data.messFromAdmin)
                const response = await bookingRepo.update(id, { status: "rejected", messFromAdmin: message });
                mailsendRejected(booking.user, booking, venue.name, data.messFromAdmin).then((response) => {
                }
                ).catch((error) => {
                });

                return response;
            }
        }



        return booking;
    } catch (error) {
        return new AppError("Error while updating booking", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function deleteBooking(id) {
    try {
        const booking = await bookingRepo.destroy(id);
        return booking;
    } catch (error) {
        return new AppError("Error while deleting booking", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateBooking(id, data) {
    try {
        const booking = await bookingRepo.update(id, data);
        return booking;
    } catch (error) {
        return new AppError("Error while updating booking status", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createBooking,
    getBooking,
    getBookingById,
    getBookingByUser,
    updateBooking,
    deleteBooking,
    updateBookingStatus
};