/*
 *    Copyright 2019 Django Cass
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import React, {useEffect, useState} from "react";
import {Code, Icon, Spinner, Table, Tooltip} from "evergreen-ui";
import getHealth from "../util/getHealth";

export default () => {
	const [status, setStatus] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		setError(null);
		fetch("http://localhost:7000/api/v3/health").then(r => {
			if (!r.ok)
				throw new Error(`HTTP error, status = ${r.status}`);
			return r.json();
		}).then(data => {
			setStatus(data);
		}).catch(err => {
			setError(err.message);
			console.log(err);
		});
	}, []);

	const getStatus = () => {
		if (error != null)
			return error;
		if (status != null)
			return getHealth(status).map(i => (
				<Tooltip content={i.key}>
					<Icon margin={2} icon={i.value === true ? "tick-circle" : "ban-circle"}
					      color={i.value === true ? "success" : "danger"}/>
				</Tooltip>
			));
		return <Spinner size={16}/>;
	};

	const rows = [
		{
			key: "URL",
			value: <Code>"https://jmp.castive.dev"</Code>
		},
		{
			key: "App status",
			value: getStatus()
		}
	];
	return (
		<Table minWidth={350}>
			<Table.Body>
				{rows.map(r => (
					<Table.Row key={r.key}>
						<Table.TextCell maxWidth={90}>{r.key}</Table.TextCell>
						<Table.TextCell>{r.value}</Table.TextCell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}