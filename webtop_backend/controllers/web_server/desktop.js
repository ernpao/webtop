
const robotjs = require('robotjs')

module.exports = {
    getDesktopInfo: (req, res) => {
        return res.json({
            success: true,
        });
    }
}