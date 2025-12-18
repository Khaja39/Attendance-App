export const logoutUser = (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};