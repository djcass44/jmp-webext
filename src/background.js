import {DEFAULT_URL} from "./util/env";

let BASE_URL = DEFAULT_URL;

const getSearchUrl = query => `${BASE_URL}/api/v2/similar/${query}?suggest=true`;
const getSourceUrl = query => `${BASE_URL}/jmp?query=${query}`;

const initUrl = async () => {
	// attempt to load the stored JMP url (or default to env)
	const data = await browser.storage.sync.get('jmp');
	return (data.jmp && data.jmp.url) || DEFAULT_URL;
};

const createSuggestions = response => {
	return new Promise(resolve => {
		const suggestions = [];
		const suggestionsOnEmptyResults = [{
			content: BASE_URL,
			description: "Nothing found"
		}];
		response.json().then(json => {
			if (!Array.isArray(json))
				return resolve(suggestionsOnEmptyResults);
			json.forEach(i => {
				suggestions.push({
					content: getSourceUrl(i),
					description: i
				});
			});
			return resolve(suggestions);
		}).catch(() => resolve(suggestionsOnEmptyResults));
	});
};

/**
 * Attempt to find an existing bookmark
 */
const onAdd = () => {
	const {omnibox} = browser;
	omnibox.setDefaultSuggestion({
		description: "Search JMP"
	});
	omnibox.onInputChanged.addListener((text, addSuggestions) => {
		// reload the url in case anything has changed
		initUrl().then(r => {
			BASE_URL = r;
			const init = {method: "GET"};
			const url = getSearchUrl(text);
			const request = new Request(url, init);
			console.log(`requesting: ${url}`);

			fetch(request).then(createSuggestions).then(addSuggestions);
		});
	});
	omnibox.onInputEntered.addListener((text, disposition) => {
		let url = text;
		if (!text.startsWith(BASE_URL))
			url = getSourceUrl(text);
		const {tabs} = browser;
		switch (disposition) {
			case "currentTab":
				tabs.update({url});
				break;
			case "newForegroundTab":
				tabs.create({url});
				break;
			case "newBackgroundTab":
				tabs.create({url, active: false});
				break;
			default:
				break;
		}
	});
};

// update when the extension loads initially
onAdd();