/* eslint-disable */

import { Router } from 'express'
import {
    register,
    loginHandler,
    authenticate,
    getProfile,
    views,
    getuserdetails,
    getUserById,
    updateUserProfile,
    stopVideoStream
} from './controller'
import { startStream, stopStream, getAllStreams, getStreamDetails, getUserStreams, deleteStream } from './streamapi/streamcontroller'
import { addViewer, removeViewer, getAllViewers, countViewers } from './Viewerapis/viewercontroller'

const router = Router()

router.route('/register').post(register)
router.route('/login').post(loginHandler)
router.route('/getuserdata').get(getuserdetails)
router.route('/getdatabyid/:id').get(getUserById)
router.route('/updatedatabyid/:id').put(updateUserProfile)

router.route('/streamsstart').post(startStream)
router.route('/streamsstop').post(stopStream)
router.route('/streamsdetails').get(getAllStreams)
router.route('/streamsdetailsid/:id').get(getStreamDetails)
router.route('/streamsuser/:userId').get(getUserStreams)
router.route('/deletestream/:id').delete(deleteStream)

router.route('/addviewer').post(addViewer)
router.route('/getallviewer').get(getAllViewers)
router.route('/countviewer/:streamId').get(countViewers)
router.route('/removeviewer/:viewerId').delete(removeViewer)

// router.route('/mutevideo/:viewerId/mute ').post(muteStream)
router.route('/stopvideo/:viewerId/stop').post(stopVideoStream)
router.route('/protected').get(authenticate, getProfile)
router.route('/viewscount/:id').get(views)

export default router
