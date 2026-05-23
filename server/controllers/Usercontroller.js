const User = require('../models/User');

/* ══════════════════════════════════════════════════════════════
   GET /api/user/profile
   Protected — requires JWT
══════════════════════════════════════════════════════════════ */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      user: {
        id:          user._id,
        fullName:    user.fullName,
        email:       user.email,
        phone:       user.phone,
        countryCode: user.countryCode,
        role:        user.role,
        isVerified:  user.isVerified,
        createdAt:   user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════════════════════════
   PUT /api/user/profile
   Protected — requires JWT
   Body: { fullName, phone, countryCode }
══════════════════════════════════════════════════════════════ */
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, countryCode } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (fullName)    user.fullName    = fullName;
    if (phone)       user.phone       = phone;
    if (countryCode) user.countryCode = countryCode;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully.',
      user: {
        id:          user._id,
        fullName:    user.fullName,
        email:       user.email,
        phone:       user.phone,
        countryCode: user.countryCode,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════════════════════════
   PUT /api/user/change-password
   Protected — requires JWT
   Body: { currentPassword, newPassword }
══════════════════════════════════════════════════════════════ */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;  // hashed by pre-save hook
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, changePassword };