import { rmSync } from "fs"
import path, { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import electron, { onstart } from "vite-plugin-electron"
import renderer from "vite-plugin-electron-renderer"
import pkg from "./package.json"

rmSync("dist", { recursive: true, force: true }) // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			}
		}
	},
	plugins: [
		vue(),
		renderer({
			resolve() {
				return [
					"classic-level"
				]
			}
		}),
		electron({
			main: {
				entry: "electron/main/index.ts",
				vite: {
					build: {
						// For Debug
						sourcemap: true,
						outDir: "dist/electron/main",
					},
					// Will start Electron via VSCode Debug
					plugins: [process.env.VSCODE_DEBUG ? onstart() : null],
				},
			},
			preload: {
				input: {
					// You can configure multiple preload here
					index: path.join(__dirname, "electron/preload/index.ts"),
				},
				vite: {
					build: {
						// For Debug
						sourcemap: "inline",
						outDir: "dist/electron/preload",
					},
				},
			},
			// Enables use of Node.js API in the Renderer-process
			// https://github.com/electron-vite/vite-plugin-electron/tree/main/packages/electron-renderer#electron-renderervite-serve
			renderer: {},
		}),
	],
	server: process.env.VSCODE_DEBUG ? {
		host: pkg.debug.env.VITE_DEV_SERVER_HOSTNAME,
		port: pkg.debug.env.VITE_DEV_SERVER_PORT,
	} : undefined,
})
