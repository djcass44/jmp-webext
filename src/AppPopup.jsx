import React, {useState, useEffect} from 'react';
import './AppPopup.css';

export default () => {
	const [color, setColor] = useState("");

	useEffect(() => {
		initColor().then();
	}, []);

	const initColor = async () => {
		const data = await browser.storage.sync.get('color');
		setColor(data.color);
	};

	const handleButtonClick = async () => {
		const tabs = await browser.tabs.query({
			active: true,
			currentWindow: true
		});
		browser.tabs.executeScript(
			tabs[0].id,
			{
				code: `document.body.style.backgroundColor = "${color}";`
			}
		);
	};
	return (
		<div className="App">
			<button
				onClick={handleButtonClick}
				style={{
					backgroundColor: color
				}}
			/>
		</div>
	);
}
