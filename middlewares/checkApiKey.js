const ApiKey = require('../models/ApiKey');

async function checkApiKey(req, res, next) {
    const apiKey = req.query.apiKey || req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ message: "API key is missing" });
    }

    const keyExists = await ApiKey.findOne({ where: { key: apiKey } });

    if (!keyExists) {
        return res.status(403).json({ message: "Invalid API key" });
    }

    req.apiUser = keyExists.userId; // utile si besoin
    next();
}

module.exports = checkApiKey;
