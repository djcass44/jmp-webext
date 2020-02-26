import React, {useEffect, useState} from 'react';
import './AppOptions.css';
import {DEFAULT_URL} from "./util/env";
import {Button, Card, Heading, Pane, TextInputField} from "evergreen-ui";

const urlRegex = new RegExp("(?:https?|ftp)://[-a-zA-Z0-9.]+(:(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9]|\\d{2,4}|[1-9]))?");

export default () => {
	// initial url loaded from storage
	const [url, setUrl] = useState<string | null>(null);
	// unsaved url being modified by the user
	const [editUrl, setEditUrl] = useState<string>(url || "");
	const [valid, setValid] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);

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
		// load the url from browser storage
		initUrl().then();
	}, []);

	const onSubmit = () => {
		if(url == null) {
			console.error("url cannot be null");
			return;
		}
		setLoading(true);
		// this spaghetti is required because firefox needs a user to trigger it
		// see here: https://stackoverflow.com/a/47729896
		const permissions = {
			origins: [`${editUrl}${!editUrl.endsWith("/") && "/"}*`]
		};
		const oldPermissions = {
			// revoke old url
			origins: [`${url}${!url.endsWith("/") && "/"}*`]
		};
		browser.permissions.request(permissions).then((response: boolean) => {
			console.log(`Got permissions: ${response}`);
			if (response) {
				browser.permissions.remove(oldPermissions).then();
				// reload the new url
				browser.storage.sync.set({jmp: {url: editUrl}}).then(() => {
					setLoading(false);
					console.log(`saved url: ${editUrl}`);
					initUrl().then();
				}).catch((err: any) => {
					setLoading(false);
					console.error(err);
				});
			}
			else {
				setLoading(false);
			}
		});
	};
	const onChange = (e: any) => {
		const {value} = e.target;
		setValid(value != null && value.length > 0 && urlRegex.test(value));
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
					onChange={(e: any) => onChange(e)}
					validationMessage={!valid ? "Must be a valid url" : null}
					isInvalid={!valid}
					padding={12}
					disabled={loading}
				/>
			</Card>
			<Pane paddingTop={8} paddingLeft={4} display="flex">
				<Button appearance="minimal" onClick={() => setEditUrl(url || "")}>Reset</Button>
				<Button appearance="primary" disabled={!valid || (editUrl === url)} isLoading={loading}
				        onClick={() => onSubmit()}>Save</Button>
			</Pane>
		</Pane>
	);
}