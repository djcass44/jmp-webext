import React from 'react';
import './AppPopup.css';
import {Card, Heading, IconButton, Pane, Tooltip} from "evergreen-ui";
import Preview from "./containers/Preview";

export default () => {
	return (
		<Pane padding={12}>
			<Heading size={700} padding={8}>JMP</Heading>
			<Card elevation={1}>
				<Preview/>
			</Card>
			<Pane paddingTop={8} paddingLeft={4} display="flex">
				<Tooltip content="Open JMP">
					<IconButton
						appearance="minimal"
						icon="document-open"
						is="a"
						target="_blank" rel="noopener noreferrer"
						href="https://jmp.castive.dev"
					/>
				</Tooltip>
			</Pane>
		</Pane>
	);
}
