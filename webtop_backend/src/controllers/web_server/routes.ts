module.exports = {
    index: (req: any, res: any) => {
        res.json({
            'success': true,
            'message': 'Webtop Backend Server'
        })
    },
}