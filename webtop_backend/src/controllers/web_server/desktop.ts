

const robotjs = require('robotjs')

module.exports = {
    getDesktopInfo: (req: any, res: any) => {
        return res.json({
            success: true,
        });
    }
}