// import { Types } from 'mongoose';
import type { Server, Socket } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

type IO = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>

type Peer = {
	userId: string
	socketId: string
}
type SendErrorMessage = {
	message: string
	reason?: string
}

type Messagge = {
	message: string
	sender: string
}

const sendError = (socket: Socket, { message, reason='' }: SendErrorMessage) => {
	socket.emit('error', {
		message,
		reason,
	})
}


let connectedPeers: Peer[] = []

export const socketController = (io: IO ) => (socket: Socket) => {

	socket.on('user-join', ({ userId }: { userId: string }) => {
		if(!userId) return sendError(socket, { message: 'userId is missing' })


		// Step-1: create new private room
		socket.join(userId)
		socket.emit('user-join', { connected: true })

		// const rooms = [ ..._io.sockets.adapter.rooms]
		// console.log(rooms)

		// Step-2: also take a reference copy
		connectedPeers.push({ userId, socketId: socket.id })
	})

	socket.on('disconnect', () => {
		connectedPeers = connectedPeers.filter(peer => peer.socketId !== socket.id)
		// console.log(connectedPeers)
	})

	socket.on('message', ({ message, sender }: Messagge ) => {
		if(!sender) return sendError(socket, { message: 'senderId is missing' })

		// just sending to everybody for testing
		io.emit('message', { message })

		// // only send to sender
		// io.to(sender).emit('message', { message })

	})
}