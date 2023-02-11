const { Client, Events, GatewayIntentBits, Collection, AttachmentBuilder } = require('discord.js')
const { createCanvas, Image } = require('@napi-rs/canvas')
const { readFile } = require('fs/promises')
const { request } = require('undici'); 

// Dotenv
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN } = process.env

// Importações de comandos.
const fs = require("node:fs")
const path = require("node:path")
const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command)
	}
	else {
		console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausente.`)
	}
}

// Login do bot.
client.once(Events.ClientReady, c => {
	console.log(`Pronto! Login realizado como ${c.user.tag}`)
})
client.login(TOKEN)

//Contexto do Canvas
const applyText = (canvas, text) => {
	const context = canvas.getContext('2d')
	let fontSize = 70

	do {
		context.font = `${fontSize -= 10}px sans-serif`;
	} while (context.measureText(text).width > canvas.width - 300)

	return context.font
}

// Listener de interações com o bot.
client.on(Events.InteractionCreate, async interaction => {

	//Perfil do usuário

	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'profile') {
		const canvas = createCanvas(700, 250)
		const context = canvas.getContext('2d')

		const background = await readFile('./commands/profile/background profile/profile-image.png')
		const backgroundImage = new Image()
		backgroundImage.src = background
		context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

		context.strokeStyle = 'white'
		context.strokeRect(0, 0, canvas.width, canvas.height)

		context.font = '28px sans-serif'
		context.fillStyle = '#ffffff'
		context.fillText('Your Profile', canvas.width / 2.5, canvas.height / 3.5)

		context.font = applyText(canvas, `${interaction.member.displayName}!`)
		context.fillStyle = '#ffffff';
		context.fillText(`${interaction.member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8)

		context.beginPath()
		context.arc(125, 125, 100, 0, Math.PI * 2, true)
		context.closePath()
		context.clip()

		const { body } = await request(interaction.user.displayAvatarURL({ format: 'jpg' }))
		const avatar = new Image()
		avatar.src = Buffer.from(await body.arrayBuffer())
		context.drawImage(avatar, 25, 25, 200, 200)

		const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

		await interaction.reply({ files: [attachment] })
	}

	//Menu de Seleção
	if (interaction.isStringSelectMenu()) {
		const selected = interaction.values[0]
		if (selected == "javascript") {
			await interaction.reply("Documentação do Javascript: https://developer.mozilla.org/en-US/docs/Web/JavaScript")
		} else if (selected == "python") {
			await interaction.reply("Documentação do Python: https://www.python.org")
		} else if (selected == "csharp") {
			await interaction.reply("Documentação do C#: https://learn.microsoft.com/en-us/dotnet/csharp/")
		} else if (selected == "discordjs") {
			await interaction.reply("Documentação do Discord.js: https://discordjs.guide/#before-you-begin")
		} else if (selected == "react") {
			await interaction.reply("Documentação do React: https://developer.mozilla.org/pt-BR/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started")
		} else if (selected == "java") {
			await interaction.reply("Documentação do Java: https://docs.oracle.com/javase/8/docs/api/")
		} else if (selected == "php") {
			await interaction.reply("Documentação do Java: https://developer.mozilla.org/pt-BR/docs/Glossary/PHP")
		}
	}

	//Erros
	if (!interaction.isChatInputCommand()) return
	const command = interaction.client.commands.get(interaction.commandName)
	if (!command) {
		console.error("Comando não encontrado")
		return
	}
	try {
		await command.execute(interaction)
	}
	catch (error) {
		console.error(error)
		await interaction.reply("Houve um erro ao executar esse comando")
	}
})
