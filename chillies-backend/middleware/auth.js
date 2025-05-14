const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token non fourni' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

exports.isSuperuser = (req, res, next) => {
  if (req.user.role !== 'superuser') {
    return res.status(403).json({ message: 'Accès refusé. Rôle superuser requis.' });
  }
  next();
}; 