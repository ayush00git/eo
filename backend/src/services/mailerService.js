
const { mailSender } = require('../config/mail-config');
const { ADMIN_EMAIL } = require('../config/server-config');

async function mailBookkingNotificationToAdmin(user, booking, venue) {
    const response = await mailSender.sendMail({
        from: "no-reply-BookingSystem@nith.ac.in",
        to: ADMIN_EMAIL,
        subject: `New Booking Request for ${venue}`,
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
    }
    h2 {
      color: #333;
    }
    p {
      color: #555;
      line-height: 1.6;
    }
    .details {
      background: #f9f9f9;
      padding: 15px;
      border-left: 4px solid #007bff;
      margin: 20px 0;
    }
    .details p {
      margin: 6px 0;
    }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #999;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>New Booking Arrival Notification</h2>
    <p>Hello Admin,</p>
    <p>This is to inform you that a user has arrived for their scheduled booking. Below are the details:</p>

    <div class="details">
      <p><strong>User Name:</strong> ${user?.name}</p>
      <p><strong>Venue:</strong> ${venue}</p>
      <p><strong>Date:</strong> ${booking.startDate}-${booking.endDate}</p>
      <p><strong>Time:</strong> ${booking.startTime} to ${booking.endTime}</p>
    </div>

    <p>Please ensure that the venue is ready and any required arrangements are in place.</p>

    <p>Best Regards,<br>
    <strong>Booking System</strong></p>

    <div class="footer">
      <p>&copy; 2025 Venue Booking System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`
    });
    return response;
}

async function mailSendApprovedSimple(user, booking, venue, mesg) { 
const response = await mailSender.sendMail({
    from: "no-reply-EstateOffice@nith.ac.in",
    to: user?.email,
    subject: 'Booking Status Update',
    text: `Your booking status has been updated. Please find the details below:\n\nStatus: ${booking.status}\n\nFor more details, visit your account or Estate Office NIT Hamirpur.`,
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Approved</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
        }
        p {
            color: #555;
            line-height: 1.6;
        }
        .guidelines {
            background: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #007bff;
            margin: 20px 0;
        }
        .guidelines ul {
            list-style-type: none;
            padding: 0;
        }
        .guidelines li {
            margin: 8px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Booking Approved</h2>
        <p>Dear <strong>${user?.name}</strong>,</p>
        <p>We are pleased to inform you that your booking request for <strong>${venue}s</strong> from 📅 <strong>${booking.startDate}</strong> @ ⏰ <strong>${booking.startTime}</strong> to 📅 <strong>${booking.endDate}</strong> @ ⏰ <strong>${booking.endTime}</strong> has been <span style="color: green;"><strong>Approved</strong></span>.</p>
        
        <div class="guidelines">
            <h3>Venue Guidelines:</h3>
            <ul>
                <li>📌 Kindly Keep the venue clean and return it to its original state after use.</li>
                <li>📌 Adhere to the maximum occupancy limit as per regulations.</li>
                <li>📌 Avoid any activities that may cause disturbance or damage to the premises.</li>
            </ul>
        </div>
        ${mesg&&`<div class="guidelines">
            <h3>Message From Admin:</h3>
            <p>${mesg}</p>
        </div>`}

        <p>If you have any special requirements or changes, kindly inform us at least <strong>24 hours in advance</strong>.</p>
        <p>We appreciate your cooperation and look forward to a smooth event.</p>

        <p>Best Regards,<br>
        <strong>Estate Officer</strong><br>
        <strong>NIT Hamirpur</strong></p>

        <div class="footer">
            <p>&copy; 2025 Venue Booking System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

});
return response;
}

async function mailSendApprovedConflicts(user, booking, venue, mesg, conflicts) {
    const response = await mailSender.sendMail({
        from:"no-reply-EstateOffice@nith.ac.in",
        to: user?.email,
        subject: 'Booking Status Update',
        html:`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Booking Approved with Conflict</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            margin: auto;
        }
        h3 {
            color: #d9534f;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 10px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
        .admin-message {
            background: #ffefc7;
            padding: 10px;
            border-left: 4px solid #d9534f;
            margin-top: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <p>Dear <strong>${user.name}</strong>,</p>

        <p>We are pleased to inform you that your booking request for <strong>${venue}</strong> from 📅 <strong>${booking.startDate}</strong> @ ⏰ <strong>${booking.startTime}</strong> to 📅 <strong>${booking.endDate}</strong> @ ⏰ <strong>${booking.endTime}</strong> has been <strong style="color: green;">Approved</strong>.</p>

        <p style="color: #d9534f;"><strong>However, your booking has conflicts with an existing reservation.</strong></p>
        <p>While your request has been accommodated, we kindly ask you to coordinate if necessary to ensure a smooth experience for all parties involved.</p>

        <h3>Conflict Details:</h3>
        <ul>
            ${conflicts.map((conflict, index) => `
                <li>
                    <strong>Conflict ${index + 1}:</strong><br>
                    <strong>Title:</strong> ${conflict.title}<br>
                    <strong>Date & Time:</strong> 📅 ${conflict.startDate} ⏰ ${conflict.startTime} - 📅 ${conflict.endDate} ⏰ ${conflict.endTime}<br>
                </li>
            `).join("")}
        </ul>

        <h3>Guidelines for Venue Usage:</h3>
        <ul>
            <li>📌 Keep the venue clean and return it to its original state after use.</li>
            <li>📌 Adhere to the maximum occupancy limit as per regulations.</li>
            <li>📌 Avoid any activities that may cause disturbance or damage to the premises.</li>
        </ul>

        ${mesg ? `<div class="admin-message"><strong>Message From Admin:</strong> ${mesg}</div>` : ""}

        <p>If you have any concerns or require assistance in resolving the conflict, please reach out to us at your earliest convenience.</p>

        <p>We appreciate your understanding and cooperation.</p>

        <p class="footer">
            Best Regards,<br>
            <strong>Estate Officer</strong><br>
            NIT Hamirpur
        </p>
    </div>
</body>
</html>
`
    });
    return response;
}

async function mailSendVictim(user, booking, venue, conflict) {
    const response=await mailSender.sendMail({
        from:"no-reply-EstateOffice@nith.ac.in",
        to: user?.email,
        subject: 'Conflict in Your Approved Booking',
        html:`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Important: Conflict in Your Approved Booking</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            margin: auto;
        }
        h3 {
            color: #d9534f;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 10px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
        .admin-message {
            background: #ffefc7;
            padding: 10px;
            border-left: 4px solid #d9534f;
            margin-top: 10px;
            border-radius: 5px;
        }
        .highlight {
            color: #d9534f;
            font-weight: bold;
        }
        .conflict-details {
            background: #f8f9fa;
            padding: 10px;
            border-left: 4px solid #f0ad4e;
            margin-top: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <p>Dear <strong>${user.name}</strong>,</p>

        <p>We hope you are doing well.</p>

        <p>We would like to inform you that your <strong>previously approved booking</strong> for <strong>${venue}</strong> from 📅 <strong>${booking.startDate}</strong> @ ⏰ <strong>${booking.startTime}</strong> to 📅 <strong>${booking.endDate}</strong> @ ⏰ <strong>${booking.endTime}</strong> now has a conflict with a newly accepted reservation.</p>

        <p class="highlight">While we strive to accommodate all requests fairly, this situation has created an overlap. We kindly request you to review your schedule and, if necessary, coordinate with the concerned party to resolve the conflict amicably.</p>

        <h3>Conflict Details:</h3>
        <div class="conflict-details">
            <p><strong>Title:</strong> ${booking.title}</p>
            <p><strong>Date & Time:</strong> 📅 ${booking.startDate}-${booking.endDate} from ⏰ ${booking.startTime} to ${booking.endTime}</p>
            <p><strong>Contact Details of the Other Party:</strong><br>
               ${booking.user.name} (<a href="mailto:${booking.user.email}">${booking.user.email}</a>)</p>
        </div>

        <h3>Guidelines for Venue Usage:</h3>
        <ul>
            <li>📌 The venue is used responsibly and left in its original condition.</li>
            <li>📌 The maximum occupancy limits are followed.</li>
            <li>📌 Any changes to your booking are communicated to us promptly.</li>
        </ul>

        <p>If you need any assistance in addressing this issue, please feel free to contact us.</p>

        <p>We appreciate your cooperation and understanding.</p>

        <p class="footer">
            Best Regards,<br>
            <strong>Estate Officer</strong><br>
            NIT Hamirpur
        </p>
    </div>
</body>
</html>`
    });
    return response;
}   

async function mailsendRejectedconflicts(user, booking, venue,conflicts, mesg) {
   const response= await mailSender.sendMail({
        from:"no-reply-EstateOffice@nith.ac.in",
        to: user?.email,
        subject: 'Booking Rejected',
        html:`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Booking Request Rejected Due to Conflict</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            margin: auto;
        }
        .header {
            color: #d9534f;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
        }
        .highlight {
            color: #d9534f;
            font-weight: bold;
        }
        .conflict-details {
            background: #f8f9fa;
            padding: 10px;
            border-left: 4px solid #d9534f;
            margin-top: 10px;
            border-radius: 5px;
        }
        .admin-message {
            background: #ffefc7;
            padding: 10px;
            border-left: 4px solid #f0ad4e;
            margin-top: 10px;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <p class="header">Booking Request Rejected</p>

        <p>Dear <strong>${user.name}</strong>,</p>

        <p>We regret to inform you that your booking request for <strong>${venue}</strong> from 📅 <strong>${booking.startDate}</strong> @ ⏰ <strong>${booking.startTime}</strong> to 📅 <strong>${booking.endDate}</strong> @ ⏰ <strong>${booking.endTime}</strong> has been <span class="highlight">rejected due to scheduling conflicts</span> with an existing approved reservation.</p>

        <p>While we strive to accommodate all requests fairly, the requested slot is unavailable as it overlaps with another confirmed booking.</p>

        <h3>Conflict Details:</h3>
        <div class="conflict-details">
            ${conflicts.map((conflict, index) => (
                `<p><strong>Conflict ${index + 1}:</strong></p>
                <p><strong>Title:</strong> ${conflict.title}</p>
                <p><strong>Date & Time:</strong> 📅 ${conflict.startDate} ⏰ ${conflict.startTime} - 📅 ${conflict.endDate} ⏰ ${conflict.endTime}</p>`
            )).join("")}
        </div>

        <p>If your schedule is flexible, we encourage you to check for alternative time slots and submit a new request accordingly.</p>

        ${mesg ? `<div class="admin-message"><strong>Message From Admin:</strong> ${mesg}</div>` : ""}

        <p>We appreciate your understanding and apologize for any inconvenience caused. If you need any assistance, feel free to reach out.</p>

        <p class="footer">
            Best Regards,<br>
            <strong>Estate Officer</strong><br>
            NIT Hamirpur
        </p>
    </div>
</body>
</html>`
    });
    return response;
}

async function mailsendRejected(user, booking, venue, mesg) {
    const response=await mailSender.sendMail({
        from:"no-reply-EstateOffice@nith.ac.in",
        to: user?.email,
        subject: 'Booking Request Rejected',
        html:`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Booking Request Rejected</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            margin: auto;
        }
        .header {
            color: #d9534f;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
        }
        .highlight {
            color: #d9534f;
            font-weight: bold;
        }
        .reason {
            background: #f8f9fa;
            padding: 10px;
            border-left: 4px solid #d9534f;
            margin-top: 10px;
            border-radius: 5px;
        }
        .admin-message {
            background: #ffefc7;
            padding: 10px;
            border-left: 4px solid #f0ad4e;
            margin-top: 10px;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <p class="header">Booking Request Rejected</p>

        <p>Dear <strong>${user.name}</strong>,</p>

        <p>We regret to inform you that your booking request for <strong>${venue}</strong> from 📅 <strong>${booking.startDate}</strong> @ ⏰ <strong>${booking.startTime}</strong> to 📅 <strong>${booking.endDate}</strong> @ ⏰ <strong>${booking.endTime}</strong> has been <span class="highlight">rejected</span> due to the following reason:</p>

        <div class="reason">
            <p><strong>Reason:</strong> ${mesg}</p>
        </div>

        <p>While we strive to accommodate all requests fairly, we were unable to approve your booking at this time.</p>

        <p>If you have any concerns or wish to submit a new request with an alternative schedule, please feel free to reach out to us.</p>

        <p>We appreciate your understanding and apologize for any inconvenience caused.</p>

        <p class="footer">
            Best Regards,<br>
            <strong>Estate Officer</strong><br>
            NIT Hamirpur
        </p>
    </div>
</body>
</html>
`
    });
    return response;
}

async function mailtoStaff(user, booking, venue) {
    const response=await mailSender.sendMail({
        from:"no-reply-EstateOffice@nith.ac.in",
        to: user?.email,
        subject: `Booking For ${venue} `,
        html:`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Booking Approved Notification</title>
  <style>
    body {
      background-color: #f6f8fa;
      font-family: 'Segoe UI', sans-serif;
      padding: 20px;
    }

    .container {
      max-width: 650px;
      margin: auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .header {
      font-size: 20px;
      font-weight: bold;
      color: #28a745;
      margin-bottom: 20px;
    }

    .content {
      font-size: 16px;
      color: #444;
      line-height: 1.6;
    }

    .info {
      margin-top: 15px;
      padding: 15px;
      background-color: #f0f4f8;
      border-left: 4px solid #0070f3;
      border-radius: 6px;
    }

    .label {
      font-weight: bold;
      color: #333;
    }

    .footer {
      font-size: 13px;
      color: #888;
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Booking Approved Notification</div>

    <div class="content">
      Dear Staff,<br><br>

      Please be informed that the following booking request has been <strong>approved</strong> by the Estate Office:
      
      <div class="info">
        <p><span class="label">Title:</span> ${booking.title}</p>
        <p><span class="label">Venue:</span> ${venue}</p>
        <p><span class="label">Date:</span> 📅 ${booking.startDate}-${booking.endDate}</p>
        <p><span class="label">Time:</span> ⏰ ${booking.startTime} to ${booking.endTime}</p>
        <p><span class="label">Requested By:</span> ${booking.user.name} (${booking.user.email})</p>
      </div>

      Kindly make any necessary arrangements and ensure the venue is accessible and ready as per the booking schedule.
    </div>

    <div class="footer">
      NIT Hamirpur | Estate Office<br>
      This is an automated message. No action is required.
    </div>
  </div>
</body>
</html>

`
    });
    return response;

}






module.exports = { mailBookkingNotificationToAdmin,mailSendApprovedSimple,mailSendApprovedConflicts,mailSendVictim,mailsendRejectedconflicts,mailsendRejected ,mailtoStaff};

