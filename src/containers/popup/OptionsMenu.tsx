import {Link, Menu} from "evergreen-ui";
import React from "react";

interface OptionsMenuProps {
	url?: string | null;
}

const linkStyle = {
	textDecoration: "none",
	color: "#101f2d"
};

const OptionsMenu: React.FC<OptionsMenuProps> = ({url}) => {

	const getPath = (path: string): string => {
		let newUrl;
		if(url && url.endsWith("/"))
			newUrl = `${url}${path}`;
		else
			newUrl = `${url}/${path}`;
		return newUrl;
	};

	return (
		<Menu>
			<Menu.Group title="JMP Actions">
				<Menu.Item is={Link} style={linkStyle} href={url}>JMP</Menu.Item>
				<Menu.Item is={Link} style={linkStyle} href={getPath("settings")}>JMP Options</Menu.Item>
				<Menu.Item is={Link} style={linkStyle} href={getPath("help")}>JMP Help</Menu.Item>
			</Menu.Group>
			<Menu.Divider/>
			<Menu.Group title="Extension Actions">
				<Menu.Item onSelect={() => browser.runtime.openOptionsPage()}>Extension Options</Menu.Item>
			</Menu.Group>
		</Menu>
	);
};
export default OptionsMenu;
