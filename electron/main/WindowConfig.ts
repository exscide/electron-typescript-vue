import fs from "fs"


export default interface WindowConfig {
	width: number,
	height: number,
	x?: number,
	y?: number,
	maximized: boolean,
}

export let config: WindowConfig = {
	// default config
	width: 746,
	height: 480,
	maximized: false
}


export function loadConfig() {
	try {
		config = JSON.parse(fs.readFileSync("window_config.json", "utf8"))
	} catch (e) {
		console.error("could not load window config", e)
	}
}


export function saveConfig() {
	try {
		fs.writeFileSync("window_config.json", JSON.stringify(config))
	} catch (e) {
		console.error("could not save window config", e)
	}
}
