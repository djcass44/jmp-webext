import React, {useEffect, useState} from 'react';
import './AppPopup.css';
import {Card, Code, Heading, IconButton, Pane, Table, Tooltip} from "evergreen-ui";

export default () => {
	const [color, setColor] = useState("");

	useEffect(() => {
		initColor().then();
	}, []);

	const initColor = async () => {
		const data = await browser.storage.sync.get('color');
		setColor(data.color);
	};

	const rows = [
		{
			key: "URL",
			value: <Code>"https://jmp.castive.dev"</Code>
		},
		{
			key: "App status",
			value: "OK"
		}
	];

	return (
		<Pane padding={12}>
			<Heading size={700} padding={8}>JMP</Heading>
			<Card elevation={1}>
				<Table minWidth={350}>
					<Table.Body>
						{rows.map(r => (
							<Table.Row>
								<Table.TextCell maxWidth={90}>{r.key}</Table.TextCell>
								<Table.TextCell>{r.value}</Table.TextCell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</Card>
			<Pane padding={12} display="flex">
				<Tooltip content="Open JMP">
					<IconButton appearance="minimal" icon="document-open"/>
				</Tooltip>
				<Tooltip content="Settings">
					<IconButton appearance="minimal" icon="settings"/>
				</Tooltip>
			</Pane>
		</Pane>
	);
}
