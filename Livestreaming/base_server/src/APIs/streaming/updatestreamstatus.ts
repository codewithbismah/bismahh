import StreamModel from './_shared/models/streammodel'

// Function to update stream status
export const updateStreamStatus = async (viewerId: string, statusUpdate: { muted?: boolean; videoStopped?: boolean }): Promise<any> => {
    try {
        const stream = await StreamModel.findOneAndUpdate({ viewerId }, { $set: statusUpdate }, { new: true })

        if (!stream) {
            throw new Error('Stream not found')
        }

        return stream
    } catch (error) {
        throw new Error(`Error updating stream status: ${error.message}`)
    }
}
