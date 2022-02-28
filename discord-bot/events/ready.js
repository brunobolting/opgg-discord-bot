module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Connected on Discord websocket! Logged in as ${client.user.tag}`)
		client.user.setPresence({ activities: [{ name: '!w help' }] })
	},
}
