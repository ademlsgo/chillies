module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== 'superuser') {
        return res.status(403).json({ message: "Superuser access required" });
    }

    next();
};
