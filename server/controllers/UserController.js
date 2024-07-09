const User = require("../models/user");
const Transaction = require("../models/transaction");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");


// Function to generate a random account number starting with specific prefixes
const generateAccountNumber = async () => {
    const prefixes = ['200', '202', '221', '119', '003', '723', '890'];
    let accountNumber = "";
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    accountNumber += prefix;

    // Generate random digits to complete the account number (adjust length as needed)
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
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

        const { firstName, lastName, email, password, phoneNumber, address, profilePicture, otherName } = req.body;

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
                role
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            console.log('Password after hashing:', user.password); 

            await user.save();

            // create Excel file
            const fileName = `${user.email}${user.firstName}${user.lastName}.xlsx`;
            const filePath = path.join(__dirname, '..', 'excel', fileName);

            // create a new workbook and worksheet
            const workbook = xlsx.utils.book_new();
            const worksheetData = [
                ['Field', 'Value'],
                ['First Name', user.firstName],
                ['Last Name', user.lastName],
                ['Other Name', user.otherName]
                ['Email', user.email],
                ['Phone Number', user.phoneNumber],
                ['Address', user.address],
                ['Account Number', user.accountNumber],
                ['Role', user.role]
            ];

            const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'User Details');

            // write workbook to file
            xlsx.writeFile(workbook, filePath);

            res.status(201).json({
                message: "User created successfully",
                user: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    address,
                    profilePicture,
                    accountNumber,
                    otherName,
                    role
                }
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message, message: "Internal server error" });
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
                res.json({ token });
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
        const user = await User.findById(userId);

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

// Export controllers
module.exports = {
    login,
    updateProfile,
    register,
    submitKyc,
    getUserDetails,
    getUserTransactions,
    payBill,
    markNotificationAsRead
};
