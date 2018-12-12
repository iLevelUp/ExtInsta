# WebExtAuto

Nico Pr

https://nicopr.fr/chromextensions

install :

- load unpacked extension in Chrome Developper Mode
- copy extension ID from extensions page
- paste extension ID in [ExtensionDir]/resources/web.js : line 10

disable Chrome debug message :

- navigate to chrome://flags
- enable "silent debugging"
- restart Chrome
	

Extended from WebExtBase : https://github.com/nicopowa/WebExtBase
	
	
## AutoContentScript methods :

```
click: click element
@param {Node} element: html node
@param {Function} callback: method called after async click
@return void

scroll: scroll element
@param {Node} element: html node
@param {number} deltaY: scroll pixels (positive or negative)
@param {Function} callback: method called after async scroll
@return void

type: type text on keyboard
@param {string} text: "some text to type"
@param {Function} callback: method called after async type
@return void

press: press single key
@param {string} key: "a" "\r"
@param {Function} callback: method called after async key press
@return void
```
	
## Observer methods :

```
watch: watch element, options see https://developer.mozilla.org/fr/docs/Web/API/MutationObserver#MutationObserverInit
@param {Node} element:
@param {(undefined|{attributeFilter: (Array<string>|undefined), attributeOldValue: (boolean|undefined), attributes: (boolean|undefined), characterData: (boolean|undefined), characterDataOldValue: (boolean|undefined), childList: (boolean|undefined), subtree: (boolean|undefined)})} options:
@param {Function} callback: method called when watched element mutates
@return {number|void} watch identifier

	callback(watchid, item, element, mutationtype, mutation) {
		// {Number} watchid : triggered watch identifier
		// {Node} item : mutation target
		// {Node} element : watched element
		// {String} mutationtype : see options
		// {object} mutation : mutation details
	}

unwatch: stop plz
@param {number} watchid: returned by watch() call
@return {void}
```

## Lazy methods :

```
delay: delay method call
@param {Function} method: the method
@param {number} ms: how many milliseconds
@param {...*} var_args: any number of arguments
@return {Number} setTimeout identifier


hooman: delay alias with predefined delays
@param {Function} method: the method
@param {string} level: god < jedi < short < medium < long  / defaults to medium
@param {...*} var_args: any number of arguments
@return {Number} setTimeout identifier
```