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
import {Alert, Pane, Spinner, Table, Text} from "evergreen-ui";
import PropTypes from "prop-types";

const Preview = ({url}) => {
	const [items, setItems] = useState({});
	const [value, setValue] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if(url != null)
			getAll(value);
	}, [value, url]);

	const getAll = (query) => {
		setLoading(true);
		fetch(`${url}/api/v2/jump?query=${query}`).then(r => {
			if (!r.ok)
				throw new Error(r.status || "An error occurred");
			return r.json();
		}).then(data => {
			const temp = {};
			// convert the pages into usable data
			data.content.forEach(i => {
				temp[i.name] = {
					url: i.location,
					id: i.id,
					name: i.name
				};
			});
			setItems(temp);
			// clear any existing error
			setError(null);
			setLoading(false);
		}).catch(err => {
			console.error(err);
			setError(err.message);
			setLoading(false);
		});
	};

	const onOpen = (target) => {
		// open a new tab
		browser.tabs.create({
			url: `${url}/jmp?id=${target.id}&query=${target.name}`,
			active: true
		}).catch(err => console.error(err));
	};

	return (
		<div>
			{error && <Alert intent="danger" title={error.toString()}/>}
			<Table minWidth={350}>
				<Table.Head>
					<Table.SearchHeaderCell value={value} onChange={e => setValue(e)}/>
					<Table.TextHeaderCell>URI</Table.TextHeaderCell>
				</Table.Head>
				<Table.Body maxHeight={200}>
					{Object.entries(items).map(([k, v], idx) => (
						<Table.Row key={idx} isSelectable onSelect={() => onOpen(v)} height={40}>
							<Table.TextCell>
								<Text marginLeft={8} size={300} fontWeight={500}>
									{k}
								</Text>
							</Table.TextCell>
							<Table.TextCell>{v.url}</Table.TextCell>
						</Table.Row>
					))}
					{loading && <Pane display="flex" alignItems="center" justifyContent="center" height={64}>
						<Spinner marginX="auto" marginY={32}/>
					</Pane>}
				</Table.Body>
			</Table>
		</div>
	);
};
Preview.propTypes = {
	url: PropTypes.string
};
Preview.defaultProps = {
	url: null
};
export default Preview;