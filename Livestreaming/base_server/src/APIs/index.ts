import { Application } from 'express'
import { API_ROOT } from '../constant/application'
import Router from '../APIs/streaming/router'
import General from './router'
import authRoutes from './user/authentication'
import userManagementRoutes from './user/management'

const App = (app: Application) => {
    app.use(`${API_ROOT}`, General)
    app.use(`${API_ROOT}`, authRoutes)
    app.use(`${API_ROOT}/user`, userManagementRoutes)
    app.use(`${API_ROOT}/registration`, Router)
    app.use(`${API_ROOT}/loggin`, Router)
    app.use(`${API_ROOT}/userdata`, Router)
    app.use(`${API_ROOT}/userdataid`, Router)
    app.use(`${API_ROOT}/updatedataid`, Router)

    app.use(`${API_ROOT}/StartStream`, Router)
    app.use(`${API_ROOT}/StopStream`, Router)
    app.use(`${API_ROOT}/GetAllStreams`, Router)
    app.use(`${API_ROOT}/GetStreamsById`, Router)
    app.use(`${API_ROOT}/GetStreamsByUser`, Router)
    app.use(`${API_ROOT}/DeleteStream`, Router)

    app.use(`${API_ROOT}/ADDviewer`, Router)
    app.use(`${API_ROOT}/Getviewer`, Router)
    app.use(`${API_ROOT}/Countviewer`, Router)
    app.use(`${API_ROOT}/Removeviewer`, Router)

    app.use(`${API_ROOT}/JOINROOM`, Router)
    app.use(`${API_ROOT}/LEAVEROOM`, Router)
    app.use(`${API_ROOT}/STREAMDATA`, Router)
    app.use(`${API_ROOT}/RECEIVESTREAM`, Router)
    //chatapi

    // app.use(`${API_ROOT}/MUTE`, Router)
    app.use(`${API_ROOT}/StopVideo`, Router)
    app.use(`${API_ROOT}/PROTECTDATA`, Router)
    app.use(`${API_ROOT}/COUNT`, Router)
}

export default App
