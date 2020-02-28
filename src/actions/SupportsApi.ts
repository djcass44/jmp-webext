import {BuildInfo} from "../config/types";

/**
 * Check the application version we are target and whether it supports advanced features
 * Functionally checks whether the app is post-springboot migration
 * @param url: the url of the JMP instance to target
 */
export default (url: string): Promise<boolean> => {
	return new Promise<boolean>(((resolve, reject) => {
		fetch(`${url}/api/actuator/info`).then(r => {
			if (!r.ok) {
				// show error information
				return new Error(r.statusText || "An error occurred");
			}
			return r.json();
		}).then((data: BuildInfo) => {
			const version = Number(data.build.version);
			// 0.5 is the spring boot version
			resolve(version >= 0.5);
		}).catch(err => {
			reject(err);
		});
	}));
}