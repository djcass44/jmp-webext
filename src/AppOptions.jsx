import React from 'react';
import './AppOptions.css';
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];

export default () => {
	const handleButtonClick = item => {
		browser.storage.sync.set({color: item}).then(() => {
			console.log('color is ' + item);
		});
	};

	return (
		<div className="Options">
			{kButtonColors.map(item => (
				<button
					key={item}
					style={{
						backgroundColor: item
					}}
					onClick={() => handleButtonClick(item)}
				/>
			))}
		</div>
	);
}