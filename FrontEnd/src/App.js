import React from 'react';
import './App.css';
import Banner from './components/banner.js';
import Main from './Main';

/*
The root class of the webpage, 'App'.
App should hold the contents of the first page the user is greeted with if they visit the webpage e.g. 'https://agme.com'.
In this case, the page shows them the login contents.
*/
const App = () => {
	return (
		// The banner is a component that is shown at the top of each page.
		// The login is kind of like a component, but is also the page they goto when they goto the root url of the website.
		<div className="App">
			<Banner/>
            <Main/>
		</div>
	);
}

export default App;
