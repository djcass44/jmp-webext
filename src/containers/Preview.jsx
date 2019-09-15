import React from "react";
import {Code, Table} from "evergreen-ui";

export default () => {
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
	);
}