module.exports = {
    checkPermissions: (message, permissions) => {
        if (!message.member.permissions.has(permissions)) {
            message.reply('You do not have permission to use this command!');
            return false;
        }
        return true;
    }
};
