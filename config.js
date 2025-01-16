/**
 * @type {{
 * webAppPort: number,
 * maxFileSize: number,
 * durationLimits: {min: number, max: number},
 * authToken: string,
 * linkShareExpiry: number}}
 */
const config = {
  webAppPort: 3000,
  maxFileSize: 25 * 1024 * 1024, // 25 MB
  durationLimits: {
    min: 5,
    max: 25,
  },
  authToken: `static-token-123`,
  linkShareExpiry: 60 * 60, // 1hr
}

module.exports = config
