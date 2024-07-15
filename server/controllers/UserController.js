const User = require("../models/user");
const Transaction = require("../models/transaction");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const mongoose = require("mongoose"); 
const multer = require("multer");
const KYC = require("../models/kyc");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const OTP = require("../models/Otp")


// Function to generate a random account number starting with specific prefixes
const generateAccountNumber = async () => {
    const prefixes = ['200', '202', '221', '119', '003', '723', '890'];
    let accountNumber = "";
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    accountNumber += prefix;

    // Generate random digits to complete the account number (adjust length as needed)
    const randomDigitsLength = 10 - prefix.length;
    const randomDigits = Math.floor(Math.pow(10, randomDigitsLength - 1) + Math.random() * (Math.pow(10, randomDigitsLength - 1)));
    accountNumber += randomDigits;

    // Check if the account number already exists in the database
    const existingUser = await User.findOne({ accountNumber });
    if (existingUser) {
        return generateAccountNumber();
    }

    return accountNumber;
};

// Register a new user
const register = [
    check("firstName").notEmpty().withMessage("First name is required"),
    check("lastName").notEmpty().withMessage("Last name is required"),
    check("email").isEmail().withMessage("Please provide a valid email"),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    check("phoneNumber").notEmpty().withMessage("Phone number is required"),
    check("address").notEmpty().withMessage("Address is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, password, phoneNumber, address, profilePicture = "", otherName = "", nextOfKin } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ error: "User already exists", message: "User already exists" });
            }

            const accountNumber = await generateAccountNumber();
            const role = (email === 'kamdilichukwu2020@gmail.com') ? 'admin' : 'user';

            user = new User({
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                address,
                profilePicture,
                accountNumber,
                otherName,
                role,
                nextOfKin
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            // Generate a token
            const payload = {
                user: {
                    id: user.id
                },
            };

            const token = jwt.sign(
                payload,
                process.env.JWTPRIVATEKEY,
                { expiresIn: '1h' }
            );

            // Create Excel file
            const fileName = `${user.email}${user.firstName}${user.lastName}.xlsx`;
            const filePath = path.join(__dirname, '..', 'excel', fileName);

            // Create a new workbook and worksheet
            const workbook = xlsx.utils.book_new();
            const worksheetData = [
                ['Field', 'Value'],
                ['First Name', user.firstName],
                ['Last Name', user.lastName],
                ['Other Name', user.otherName],
                ['Email', user.email],
                ['Phone Number', user.phoneNumber],
                ['Address', user.address],
                ['Account Number', user.accountNumber],
                ['Role', user.role]
            ];

            const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'User Details');

            // Write workbook to file
            xlsx.writeFile(workbook, filePath);

            // Send response
            return res.status(201).json({
                message: "User created successfully",
                token,  
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    accountNumber: user.accountNumber,
                    otherName: user.otherName,
                    role: user.role
                }
            });

        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: error.message, message: "Internal server error" });
        }
    }
];

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User does not exist", message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials", message: "Invalid credentials" });
        }

        const payload = {
            user: {
                id: user.id
            },
        };

        jwt.sign(
            payload,
            process.env.JWTPRIVATEKEY,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                    }
                })
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    const userId = req.body.userId;
    const updates = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found", message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", updatedUser });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Submit KYC
const submitKyc = async (req, res) => {
    const userId = req.body.userId;
    const kycDetails = req.body.kyc;

    try {
        const updateUser = await User.findByIdAndUpdate(userId, { kycDetails }, { new: true });

        if (!updateUser) {
            return res.status(404).json({ error: "User not found", message: "User not found" });
        }

        res.status(200).json({ message: "KYC submitted successfully", updateUser });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get user details
const getUserDetails = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      console.log(`Fetching user with ID: ${userId}`);
      
      const user = await User.findById(userId).populate('nextOfKin');
  
      if (!user) {
        return res.status(404).json({ error: "User not found", message: "User not found" });
      }
  
      res.status(200).json({ message: "User details retrieved successfully", user });
  
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server Error' });
    }
};

// Get user transactions
const getUserTransactions = async (req, res) => {
    const userId = req.params.userId;

    try {
        const transactions = await Transaction.find({ userId });

        res.status(200).json({ message: "User transactions retrieved successfully", transactions });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Pay bill
const payBill = [
    // Validation rules
    check("userId").isMongoId().withMessage("Invalid user ID"),
    check("amount").isFloat({ min: 0 }).withMessage("Amount must be a positive number"),
    check("billType").notEmpty().withMessage("Bill type is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, amount, billType } = req.body;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: "User not found", message: "User not found" });
            }

            if (user.balance < amount) {
                return res.status(400).json({ error: "Insufficient funds", message: "Insufficient funds" });
            }

            // Deduct the amount from the user's balance
            user.balance -= amount;

            // Save the transaction
            const transaction = new Transaction({
                sender: userId,
                recipient: null,
                amount,
                transactionType: 'billPayment'
            });

            await transaction.save();
            await user.save();

            res.status(200).json({ message: "Bill payment successful", transaction });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Server Error' });
        }
    }
];

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });

        if (!notification) {
            return res.status(404).json({ error: "Notification not found", message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification marked as read", notification });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// delete user 
const deleteUser = async (req, res) => {
    const { userId } = req.params

    try {
        const user = await User.findByIdAndDelete(userId)

        if(!user) return res.status(404).json({
            error: "User not found",
            message: "User not found"
        })

        res.status(200).json({ message: "User deleted Successfully", user })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: "Server Error" })
    }
}

const updateStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;
  
    // Validate the status value
    const validStatuses = ['single', 'married', 'divorced', 'widow', 'others'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }
  
    // Check if userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID format' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      user.status = status;
      await user.save();
  
      res.status(200).json({ message: 'User status updated successfully', user });
    } catch (error) {
      console.error('Error updating user status:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
};

// update user email
const updateEmail = async (req, res) => {
    const { newEmail, password } = req.body;

    try {
         // Validate request body
         if (!newEmail || !password) {
            return res.status(400).json({ error: "Please provide both email and password", message: "Please provide both email and password" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found", message: "User not found" });
        }

        // Check if the new email is already in use
        if (await User.findOne({ email: newEmail })) {
            return res.status(400).json({ error: "Email already in use", message: "Email already in use" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password", message: "Invalid password" });
        }

        // Update email
        user.email = newEmail;

        await user.save();

        // Generate a new token
        const payload = {
            user: {
                id: user.id
            },
        };

        const token = jwt.sign(
            payload,
            process.env.JWTPRIVATEKEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Email updated successfully",
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                accountNumber: user.accountNumber,
                otherName: user.otherName,
                role: user.role
            }
        });


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message, message: "Internal server error" });
    }
}

// change password
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }

        // check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        //Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

// Forget password - send OTP
const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found", message: "User not found" });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

        // Store OTP in the database
        const newOtp = new OTP({ email, otp });
        await newOtp.save();

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ message: "Error sending email" });
            } else {
                res.status(200).json({ message: "OTP sent successfully" });
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

// Verify OTP and reset password
const verifyOtpAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ error: "Invalid OTP", message: "Invalid OTP" });
        }

        // Check if OTP is expired (assuming OTP model has a createdAt field)
        const now = new Date();
        const otpAge = (now - otpRecord.createdAt) / 1000; // in seconds
        if (otpAge > 600) { // 10 minutes
            return res.status(400).json({ error: "OTP expired", message: "OTP expired" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found", message: "User not found" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        await OTP.deleteOne({ _id: otpRecord._id }); // Delete the used OTP

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }

}



// Export controllers
module.exports = {
    login,
    updateProfile,
    register,
    submitKyc,
    getUserDetails,
    getUserTransactions,
    payBill,
    markNotificationAsRead,
    deleteUser,
    updateStatus,
    updateEmail,
    changePassword,
    sendOtp,
    verifyOtpAndResetPassword
};
