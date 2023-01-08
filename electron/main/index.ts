import { app, BrowserWindow, shell } from "electron"
import { release } from "os"
import { join } from "path"
import { initialize, enable } from "@electron/remote/main"
initialize()

import { config, loadConfig, saveConfig } from "./WindowConfig"
import { ROOT_PATH } from "./common"


// disable GPU acceleration for windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration()

// set application name for windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
	app.quit()
	process.exit(0)
}


// load config
loadConfig()


export let win: BrowserWindow | null = null
const preload = join(__dirname, "../preload/index.js")
const url = process.env.VITE_DEV_SERVER_URL as string
const indexHtml = join(ROOT_PATH.dist, "index.html")


async function createWindow() {
	win = new BrowserWindow({
		// apply config
		width: config.width,
		height: config.height,
		x: config.x,
		y: config.y,

		// don't show until ready
		show: false,

		autoHideMenuBar: true,
		darkTheme: true,
		//transparent: true,
		title: "",
		icon: join(ROOT_PATH.public, "icon.ico"),
		titleBarStyle: "hidden",
		titleBarOverlay: {
			color: "#000",
			symbolColor: "#fff",
			height: 32,
		},

		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: false,
		},
	})
	enable(win.webContents)

	if (app.isPackaged) {
		win.loadFile(indexHtml)
	} else {
		win.loadURL(url)
		//win.webContents.openDevTools()
	}

	// make all links open within the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("https:")) shell.openExternal(url)
		return { action: "deny" }
	})


	// events

	win.once("ready-to-show", () => {
		if (config.maximized) win.maximize()
		win.show()
	})
	win.on("close", (e) => {
		//e.preventDefault()
	})
	
	// save config
	win.on("resized", () => {
		let size = win.getSize()
		config.width = size[0]
		config.height = size[1]
		saveConfig()
	})
	win.on("moved", () => {
		let pos = win.getPosition()
		config.x = pos[0]
		config.y = pos[1]
		saveConfig()
	})
	win.on("maximize", () => {
		config.maximized = true
		saveConfig()
	})
	win.on("unmaximize", () => {
		config.maximized = false
		saveConfig()
	})
}

app.whenReady().then(() => {
	createWindow()
})

app.on("second-instance", () => {
	if (win) {
		// focus on the main window if the user tried to open another
		if (win.isMinimized()) win.restore()
		win.focus()
	}
})
