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
import {Jump, Page} from "../config/types";
import SupportsApi from "../actions/SupportsApi";

interface PreviewProps {
	url: string | null;
}

const Preview: React.FC<PreviewProps> = ({url}) => {
	const [items, setItems] = useState<Map<string, Jump>>(new Map());
	const [value, setValue] = useState<string>("");
	const [error, setError] = useState<any | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [supported, setSupported] = useState<boolean | null>(null);

	useEffect(() => {
		if(url != null) {
			SupportsApi(url).then(v => setSupported(v)).catch(err => {
				setSupported(false);
				setError(err);
			});
		}
	}, [url]);

	useEffect(() => {
		// require the url and whether the api supports advanced features before proceeding
		if(url != null && supported != null)
			getAll(value);
	}, [value, url, supported]);

	const getAll = (query: string) => {
		setLoading(true);
		fetch(`${url}/api/v2/jump?query=${query}`).then(r => {
			if (!r.ok)
				throw new Error(r.statusText || "An error occurred");
			return r.json();
		}).then((data: Page<Jump>) => {
			const temp = new Map();
			// convert the pages into usable data
			data.content.forEach((i: Jump) => {
				temp.set(i.name, {
					location: i.location,
					id: i.id,
					name: i.name
				});
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

	const onOpen = (target: Jump) => {
		// open a new tab
		browser.tabs.create({
			url: `${url}/jmp?id=${target.id}&query=${target.name}`,
			active: true
		}).catch((err: any) => console.error(err));
	};

	return (
		<div>
			{error && <Alert intent="danger" title={error.toString()}/>}
			{supported != null && !supported ?
				<Alert intent="warning" title={<span>Unsupported API version<br/><small>Features may be limited</small></span>}/>
				:
				<Table minWidth={350}>
					<Table.Head>
						<Table.SearchHeaderCell value={value} onChange={e => setValue(e)}/>
						<Table.TextHeaderCell>URI</Table.TextHeaderCell>
					</Table.Head>
					<Table.Body maxHeight={200}>
						{Array.from(items.entries()).map(([k, v], idx) => (
							<Table.Row key={idx} isSelectable onSelect={() => onOpen(v)} height={40}>
								<Table.TextCell>
									<Text marginLeft={8} size={300} fontWeight={500}>
										{k}
									</Text>
								</Table.TextCell>
								<Table.TextCell>{v.location}</Table.TextCell>
							</Table.Row>
						))}
						{items.size === 0 && <Alert intent="none" title="No Jumps found"/>}
						{loading && <Pane display="flex" alignItems="center" justifyContent="center" height={64}>
							<Spinner marginX="auto" marginY={32} size={24}/>
						</Pane>}
					</Table.Body>
				</Table>
			}
		</div>
	);
};
export default Preview;
