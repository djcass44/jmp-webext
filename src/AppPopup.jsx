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
import {Button, Code, Pane, Tooltip} from "evergreen-ui";
import Preview from "./containers/Preview";
import {DEFAULT_URL} from "./util/env";

export default () => {
	const [url, setUrl] = useState(null);

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

	const goHome = () => {
		browser.tabs.create({
			url,
			active: true
		}).catch(err => console.error(err));
	};

	return (
		<Pane>
			<Pane padding={24}>
				<div style={{padding: 8, fontSize: 24}}>
					<img src="/favicon.png" width={29} height={29} alt="JMP favicon" style={{float: "left"}}/>
					JMP
				</div>
				<Tooltip content="Go to extension settings to change url">
					<Code>{url}</Code>
				</Tooltip>
				<Button
					height={22}
					marginLeft={8}
					isLoading={url == null}
					onClick={goHome}>
					Open
				</Button>
			</Pane>
			<div>
				<Preview url={url}/>
			</div>
		</Pane>
	);
}
