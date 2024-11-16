import app from '../app'
// const {  server } = require('../APIs/streaming/Stream Control Api/streamcontrolapis')
import { bootstrap } from '../bootstrap'
import config from '../config/config'
import logger from '../handlers/logger'

const server = app.listen(config.PORT)
void (async () => {
    try {
        await bootstrap().then(() => {
            logger.info(`Application started on port ${config.PORT}`, {
                meta: { SERVER_URL: config.SERVER_URL }
            })
        })
    } catch (error) {
        logger.error(`Error starting server:`, { meta: error })
        server.close((err) => {
            if (err) logger.error(`error`, { meta: error })

            process.exit(1)
        })
    }
})()

// const PORT = 4000
// app.listen(PORT, () => {
//     logger.info(`App is listening at port ${PORT}...`)
// })
