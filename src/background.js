import {DEFAULT_URL} from "./util/env";
import {getStoredData} from "./util/storage";

let BASE_URL = DEFAULT_URL;

const getSearchUrl = query => `${BASE_URL}/api/v2/similar/${query}?suggest=true`;
const getSourceUrl = query => `${BASE_URL}/jmp?query=${query}`;

const initUrl = async () => {
	// attempt to load the stored JMP url (or default to env)
	const data = await getStoredData();
	return (data && data.url) || DEFAULT_URL;
};

const createSuggestions = (query, response) => {
	return new Promise(resolve => {
		const suggestions = [];
		const suggestionsOnEmptyResults = [{
			content: BASE_URL,
			description: '<dim>Nothing found</dim>'
		}];
		response.json().then(json => {
			if (!Array.isArray(json))
				return resolve(suggestionsOnEmptyResults);
			json.forEach(i => {
				suggestions.push({
					content: getSourceUrl(i),
					description: '<dim>JMP</dim> - ' + getMatchedQuery(query, i.split("&")[0])
				});
			});
			return resolve(suggestions);
		}).catch(() => resolve(suggestionsOnEmptyResults));
	});
};

const getMatchedQuery = (query, text) => {
	if(!text.includes(query))
		return text;

	const matchStart = text.indexOf(query);
	return text.substring(0, matchStart) + "<match>" + text.substr(matchStart, query.length) + "</match>" + text.substring(matchStart + query.length, text.length);
};

/**
 * Attempt to find an existing bookmark
 */
const onAdd = () => {
	const {omnibox} = browser;
	omnibox.onInputStarted.addListener(function() {
		updateDefaultSuggestion('');
	});

	omnibox.onInputCancelled.addListener(function() {
		resetDefaultSuggestion();
	});
	omnibox.onInputChanged.addListener((text, addSuggestions) => {
		updateDefaultSuggestion(text);
		if (!text)
			return;
		// reload the url in case anything has changed
		initUrl().then(r => {
			BASE_URL = r;
			const url = getSearchUrl(text);
			const request = new Request(url, {method: "GET"});

			fetch(request).then(res => {
				createSuggestions(text, res).then(addSuggestions);
			});
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

const resetDefaultSuggestion = () => {
	browser.omnibox.setDefaultSuggestion({
		description: '<dim>JMP</dim> - Search something'
	});
};

resetDefaultSuggestion();

const updateDefaultSuggestion = (text) => {
	const description = '<match>' + text + '</match>';
	browser.omnibox.setDefaultSuggestion({
		description
	});
};

// update when the extension loads initially
onAdd();