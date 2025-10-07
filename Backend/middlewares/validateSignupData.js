const validateSignupData = (req, res, next) => {
    const { firstName, lastName, age, email, password } = req.body;

    if (!firstName || !lastName) {
        return res.status(400).json({ error: "First/Last name is required" });
    }

    if (!age || typeof age !== 'number' || age < 10) {
        return res.status(400).json({ error: "Age should be a number greater than 10" });
    }

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    next();
};

module.exports = validateSignupData;
