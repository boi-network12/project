const User = require("../models/user");
const bcrypt = require("bcryptjs");

// function to generate a random account number starting with specific prefixes

const generateAccountNumber = async () => {
    const prefixes = ['200', '202', '221', '119', '003', '723', '890'];
    let accountNumber = "";
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    accountNumber += prefix;

    // Generate random digits to compare the account number (adjust length as needed)
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    accountNumber += randomDigits;

    // check if the account number already exist in the database
    const existingUser = await User.findOne({ accountNumber });

    if (existingUser) {
        return generateAccountNumber();
    }

    return accountNumber;
}

// Register a new user 
const register = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address
    } = req.body;

    try {
        // check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                error: "User already exists",
                message: "User already exists"
            });
        }

        // Generate unique account Number
        const accountNumber = await generateAccountNumber();

        // create new user instances 
        user = new User({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            address,
            accountNumber
        });

        // Hash password
        const salt = await bcrypt.getSalt(process.env.SALT);
        user.password = await bcrypt.hash(password, salt);

        //save user to db
        await user.save();

        res.status(201).json({
            message: "User created successfully"
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                firstName,
                lastName,
                email,
                phoneNumber,
                address,
                accountNumber
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: error.message,
            message: "Internal server error"
        });
    }
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;


    try {
        // check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                error: "User does not exist",
                message: "User does not exist"
            });
        }

        // compare password
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                error: "Invalid credentials",
                message: "Invalid credentials"
            });
        }

        // Return JWT toke or session token  
        // Example: JWT token generation
        
        res.status(200).json({
            message: "Login successful"
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateProfile = async (req, res) => {
    const userId = req.body.userId;
    const updates = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true
        });

        if(!updatedUser){
            return res.status(404).json({
                error: "User not found",
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
        }, 
        updatedUser
    )
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' })
    }
};

// for submit kyc 
const submitKyc = async (req, res) => {
    const userId = req.body.userId;
    const kycDetails = req.body.kyc;

    try {
        const updateUser = await User.findByIdAndUpdate(userId, { kycDetails }, { new: true});

        if(!updateUser){
            return res.status(404).json({
                error: "User not found",
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Kyc submitted successfully",
            updateUser
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// get user details
const getUserDetails = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                error: "user not found",
                message: "user not found"
            });
        }

        res.status(200).json({
            message: "user details retrieved successfully",
            user
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
}

// transaction history
const getUserTransactions = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch and return user transaction history
        // Ensure security measures to protect sensitive financial data

        res.status(200).json({
            message: "User transactions retrieved successfully",
            transactions
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


// other controller functions for user management: submitKyc, getUserDetails , getUserTransactions
// 
module.exports = {
    login,
    updateProfile,
    register,
    submitKyc,
    getUserDetails,
    getUserTransactions
    // other controller
}