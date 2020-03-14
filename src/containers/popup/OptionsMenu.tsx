import {Menu} from "evergreen-ui";
import React from "react";

interface OptionsMenuProps {
	url?: string | null;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({url}) => {

	const openTab = (target: string): void => {
		browser.tabs.create({
			url: target,
			active: true
		}).catch((err: any) => console.error(err));
	};

	const openPath = (path: string) => {
		let settingsUrl;
		if(url && url.endsWith("/"))
			settingsUrl = `${url}${path}`;
		else
			settingsUrl = `${url}/${path}`;
		openTab(settingsUrl);
	};

	return (
		<Menu>
			<Menu.Group title="JMP Actions">
				<Menu.Item onSelect={() => openPath("")}>JMP</Menu.Item>
				<Menu.Item onSelect={() => openPath("settings")}>JMP Options</Menu.Item>
				<Menu.Item onSelect={() => openPath("help")}>JMP Help</Menu.Item>
			</Menu.Group>
			<Menu.Divider/>
			<Menu.Group title="Extension Actions">
				<Menu.Item onSelect={() => browser.runtime.openOptionsPage()}>Extension Options</Menu.Item>
			</Menu.Group>
		</Menu>
	);
};
export default OptionsMenu;
