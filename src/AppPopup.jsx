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

import React, {useEffect, useState} from 'react';
import './AppPopup.css';
import {Card, Heading, IconButton, Pane, Tooltip} from "evergreen-ui";
import Preview from "./containers/Preview";
import {DEFAULT_URL} from "./util/env";

export default () => {
	const [url, setUrl] = useState(DEFAULT_URL);

	const initUrl = async () => {
		// attempt to load the stored JMP url (or default to env)
		const data = await browser.storage.sync.get('jmp');
		const storedUrl = (data.jmp && data.jmp.url) || DEFAULT_URL;
		console.log(`Retrieved url: ${storedUrl}`);
		setUrl(storedUrl);
	};

	// on-start hook
	useEffect(() => {
		initUrl().then();
	}, []);

	return (
		<Pane padding={12}>
			<Heading size={700} padding={8}>JMP</Heading>
			<Card elevation={1}>
				<Preview url={url}/>
			</Card>
			<Pane paddingTop={8} paddingLeft={4} display="flex">
				<Tooltip content="Open JMP">
					<IconButton
						appearance="minimal"
						icon="document-open"
						is="a"
						target="_blank" rel="noopener noreferrer"
						href={url}
					/>
				</Tooltip>
			</Pane>
		</Pane>
	);
}
