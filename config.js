const config = {
    webAppPort: 3000,
    maxFileSize: 25 * 1024 * 1024, // 25 MB
    durationLimits: {
        min: 5,
        max: 25
    },
    authToken: `static-token-123`
}

module.exports = config
