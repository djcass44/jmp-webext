import React, {useEffect, useState} from 'react';
import './AppOptions.css';
import {DEFAULT_URL} from "./util/env";
import {Button, Card, Heading, Pane, TextInputField} from "evergreen-ui";

const urlRegex = new RegExp("https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)");

export default () => {
	// initial url loaded from storage
	const [url, setUrl] = useState(DEFAULT_URL);
	// unsaved url being modified by the user
	const [editUrl, setEditUrl] = React.useState(url || "");
	const [valid, setValid] = useState(true);
	const [loading, setLoading] = useState(false);

	const initUrl = async () => {
		// attempt to load the stored JMP url (or default to env)
		const data = await browser.storage.sync.get('jmp');
		const storedUrl = (data.jmp && data.jmp.url) || DEFAULT_URL;
		console.log(`Retrieved url: ${storedUrl}`);
		setUrl(storedUrl);
		setEditUrl(storedUrl);
	};

	// on-start hook
	useEffect(() => {
		initUrl().then();
	}, []);

	const onSubmit = () => {
		setLoading(true);
		browser.storage.sync.set({jmp: {url: editUrl}}).then(() => {
			setLoading(false);
			console.log(`saved url: ${editUrl}`);
		}).catch(err => {
			setLoading(false);
			console.error(err);
		});
	};
	const onChange = e => {
		const {value} = e.target;
		setValid(value.length > 0 && urlRegex.test(value) === true);
		setEditUrl(value);
	};

	return (
		<Pane padding={12}>
			<Heading size={700} padding={8}>JMP options</Heading>
			<Card elevation={1}>
				<TextInputField
					width="100%"
					required
					label="JMP base url"
					placeholder="https://jmp.example.org"
					value={editUrl}
					onChange={e => onChange(e)}
					validationMessage={valid === false ? "Must be a valid url" : null}
					isInvalid={!valid}
					padding={12}
				/>
			</Card>
			<Pane paddingTop={8} paddingLeft={4} display="flex">
				<Button appearance="minimal" onClick={() => setEditUrl(url)}>Reset</Button>
				<Button appearance="primary" disabled={valid === false} isLoading={loading}
				        onClick={() => onSubmit()}>Save</Button>
			</Pane>
		</Pane>
	);
}