//const bodyParser = require('body-parser')
const User = require('../models/User')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const constant = require("../../common/constant");
const moment = require('moment-timezone');
const md5 = require('md5')
const nodemailer = require('nodemailer');
//const nodemailer = require('nodemailer');
// var passport = require('passport');
// require('../config/passport')(passport);
// var getToken = function (headers) {
//   if (headers && headers.authorization) {
//     var parted = headers.authorization.split(' ');
//     if (parted.length === 2) {
//       return parted[1];
//     } else {
//       return null;
//     }
//   } else {
//     return null;
//   }
// };


/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to create a new user
 **/
const signup = (req, res) => {

  console.log('<<<<<<<<<<<', JSON.stringify(req.body))
  if (!req.body.firstName && !req.body.middleName && !req.body.lastName && !req.body.email && !req.body.password && !req.body.userType) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ['email', 'password', 'userType']);
  if (flag) {
    return res.json(flag);
  }
  User.findOne({ email: req.body.email }, (err, result) => {
    if (result) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.ALL_READY_EXIST_EMAIL
      })
    } else {
      //let now = new Date();
      let unix_time = moment().unix()
      let salt = data.user_contact + unix_time
      let accessToken = md5(salt)
      req.body.accessToken = accessToken
      User.create(req.body, (err, result) => {
		  console.log('RES-FIND',err, result);
        if (err) {
          return res.send({
			errr : err,
            code: httpResponseCode.BAD_REQUEST,
            message: httpResponseMessage.INTERNAL_SERVER_ERROR
          })
        } else {
          delete result.password

				// Generate test SMTP service account from ethereal.email
				// Only needed if you don't have a real mail account for testing

					// create reusable transporter object using the default SMTP transport
					let transporter = nodemailer.createTransport({
						host: constant.SMTP_HOST,
						port: constant.SMTP_PORT,
						secure: false, // true for 465, false for other ports
						auth: {
							user: constant.SMTP_USERNAME, // generated ethereal user
							pass: constant.SMTP_PASSWORD // generated ethereal password
						}
					});
					host=req.get('host');
					link="http://"+req.get('host')+"/user/verifyEmail/"+result._id;
					// setup email data with unicode symbols
					let mailOptions = {
						from: constant.SMTP_FROM_EMAIL, // sender address
						to: 'rajiv.kumar.newmediaguru@gmail.com, rajiv.kumar@newmediaguru.net', // list of receivers
						subject: 'Please confirm your Email account ✔', // Subject line
						text: 'Hello world?', // plain text body
						html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
					};

					// send mail with defined transport object
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}
						console.log('Message sent: %s', info.messageId);
						// Preview only available when sending through an Ethereal account
						console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

						// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
						// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
					});

          return res.send({
            code: httpResponseCode.EVERYTHING_IS_OK,
            message: httpResponseMessage.SUCCESSFULLY_DONE,
            result: result
          })

        }
      })
    }
  })
}

/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to verify user and login
 **/
const login = (req, res) => {
	console.log("login",req.body);
    if (!req.body.email && !req.body.password && !req.body.userType) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ['email', 'password', 'userType']);
  if (flag) {
    return res.json(flag);
  }
  User.findOne({ email: req.body.email, userType: req.body.userType }, (err, result) => {
    if (err) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.INTERNAL_SERVER_ERROR
      })
    } else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      } else if (result.userType === req.body.userType) {
        result.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            var now = new Date();
            var unix_time = moment().unix()
            var salt = data.user_contact + unix_time
            var accessToken = md5(salt)

            var updateObj = {};
            updateObj.accessToken = accessToken;
            updateObj.deviceToken = req.body.deviceToken;
            User.findOneAndUpdate({
              _id: result._id
            }, {
                '$set': updateObj
              }, {
                new: true
              }).lean().exec(function (err, result) {
                if (err)
                  return res.send({
                    code: httpResponseCode.BAD_REQUEST,
                    message: httpResponseMessage.INTERNAL_SERVER_ERROR
                  })
                })


            return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.LOGIN_SUCCESSFULLY,
             result: result
            });

          } else {
            return res.json({
              message: httpResponseMessage.INVALID_USER_PASSWORD,
              code: httpResponseCode.BAD_REQUEST,
            });
          }
        });
      } else {
        return res.json({
          message: httpResponseMessage.INVALID_USER_PASSWORD,
          code: httpResponseCode.BAD_REQUEST,
        });
      }


    }

  })
}


/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to list the available user on the plateform
 **/
const listUser = (req, res) => {
  //var token = getToken(req.headers);
  // if (token) {
    User.find({}, (err, result) => {
      if (err) {
        return res.send({
          code: httpResponseCode.BAD_REQUEST,
          message: httpResponseMessage.INTERNAL_SERVER_ERROR
        })
      } else {
        if (!result) {
          res.json({
            message: httpResponseMessage.USER_NOT_FOUND,
            code: httpResponseMessage.BAD_REQUEST
          });
        }else {
          return res.json({
                code: httpResponseCode.EVERYTHING_IS_OK,
                message: httpResponseMessage.LOGIN_SUCCESSFULLY,
               result: result
              });

        }
      }
    });
  // } else {
  //   return res.status(403).send({code: 403, message: 'Unauthorized.'});
  // }
}

//Auther	: Rajiv Kumar Date	: June 22, 2018
//Description : Function to list the available users with pagination
  const users = (req, res) => {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    User.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, users) {
          User.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: users,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
              });
            })
        });
    }


/** Auther	: Rajiv umar
 *  Date	: June 20, 2018
 *	Description : Function to view the available user details
 **/
const viewUser = (req, res) => {
	const id = req.params.id;
	//console.log('<<<<<<<<<<<',id);
	User.findOne({_id:id}, (err, result) => {
    if (err) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.INTERNAL_SERVER_ERROR
      })
    } else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      }else {
        return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });

      }
    }
  })
}
/** Auther	: karnika sharma
 *  Date	: July 6, 2018
 *	Description : Function to view the available user details
 **/
const viewAdmin = (req, res) => {
	const id = req.params;
	console.log('<<<<<<<<<<<',req.params);
	User.findOne({userType:id}, (err, result) => {
    if (err) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.INTERNAL_SERVER_ERROR
      })
    } else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      }else {
        return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });

      }
    }
  })
}


/** Auther	: Rajiv umar
 *  Date	: June 18, 2018
 *	Description : Function to update the user details.
 **/
const updateUser = (req, res) => {
  User.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      }else {
        return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });

      }
    }
  })
}
/** Auther	: Karnika sharma
 *  Date	: July 6, 2018
 *	Description : Function to update the admin profile.
 **/
const updateAdmin = (req, res) => {
  User.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      }else {
        return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });

      }
    }
  })
}
/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to update the user status.
 **/
const changeStatus = (req, res) => {
  User.update({ _id:req.body._id },  { "$set": { "userStatus": req.body.userStatus } }, { new:true }, (err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      }else {
        return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.CHANGE_STATUS_SUCCESSFULLY,
             result: result
            });
      }
    }
  })
}
/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to delete the user
 **/
const deleteUser = (req, res) => {
	User.findByIdAndRemove(req.params.id, (err,result) => {
    if(err){
		return res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
    }
		return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });
  })
}


/** Auther	: Rajiv Kumar
 *  Date	: June 20, 2018
 *	Description : Function to verify user email
 **/
const verifyEmail = (req, res) => {
  User.update({ _id:req.params.id },  { "$set": { "emailVerified": 1 } }, { new:true }, (err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      }else {
        return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.EMAIL_VERIFY_SUCCESSFULLY,
             result: result
            });

      }
    }
  })
}


/// Log out users
exports.logout = function(req, res, next) {
  var data = req.body;

  var flag = form_validation.validate_all_request(data, ['userId', 'accessToken']);
  if (flag) {
    res.json(flag);
    return;
  }
  var updateObj = {};
  updateObj.accessToken = null;
  User.findOneAndUpdate({
    _id: req.body.userId
  }, {
    '$set': updateObj
  }, {
   projection: {
      email: 1,
      name: 1,
      phoneNumber: 1,
      accessToken: 1,
      profilePic: 1,
      subscriptionPlan: 1,
      userType: 1,
      address: 1,
      zipCode: 1,
      userStatus: 1,
      emailVerified: 1
    },
    new: true
  }).lean().exec(function(err, result) {
    if (err) {
      console.log("error", err);

      return res.json({
        message: constant.server_error_msg,
        code: constant.server_error_code
      });


    } else {

      return res.json({
        message: constant.logout_success_msg,
        code: constant.logout_success_code
      });

    }


  });
}

//contactus form
const contustUs = (req, res) => {
	console.log('COntact us form');
	res.render('contactus');
 }

const send = (req, res) => {
	console.log(req.body.name);

  const output =`<p>You have a new contact request</p>
  <h3>Contact Deatils</h3>
  <ul>
	<li>${req.body.name}</li>
	<li>${req.body.email}</li>
  </ul>
  <h4>${req.body.message}</h4>`;

  // Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: constant.SMTP_HOST,
			port: constant.SMTP_PORT,
			secure: false, // true for 465, false for other ports
			auth: {
				//~ user: account.user, // generated ethereal user
				//~ pass: account.pass // generated ethereal password
				user: constant.SMTP_USERNAME, // generated ethereal user
				pass: constant.SMTP_PASSWORD // generated ethereal password
			}
		});

		// setup email data with unicode symbols
		let mailOptions = {
			from: constant.SMTP_FROM_EMAIL, // sender address
			to: 'rajiv.kumar.newmediaguru@gmail.com, rajiv.kumar@newmediaguru.net', // list of receivers
			subject: 'Node Contact Request ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: output // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
			res.render('contactus',{msg:'Email has been send'})
			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
			// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		});
}

module.exports = {
	signup,
	login,
	listUser,
	updateUser,
	viewUser,
	verifyEmail,
	changeStatus,
	deleteUser,
	users,
	contustUs,
	send
}
