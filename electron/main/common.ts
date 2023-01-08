import { app } from "electron"

import { join } from "path"


export const ROOT_PATH = {
	// /dist
	dist: join(__dirname, "../.."),
	// /dist or /public
	public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
}
