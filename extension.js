/**
* @nocollapse
* @extends {AutoContentScript}
* @final
*/
var save = null;
var state = "begin"
var followList = ["sissymua"]
var hashList = ["helloworld"]
var hashFound = [];
var hashRelevant = [];


class CustomExtensionContent extends AutoContentScript {

	constructor() {
		super(); // useless, for closure compiler
	}

	static initialized() { // content script is linked to background, ready
		// no super call, override only

		trace(this.name, "custom init");
		const target = document.querySelector("nav");
		Observer.watch(target, {attributes: true, characterData: true, childList: true, subtree: true}, function

			callback(watchid, item, element, mutationtype, mutation) {
			if (mutationtype == 'childList') {
				if (mutation.addedNodes = "NodeList [div]")
					save = mutation.addedNodes;
				//save = save.childNodes;
				console.log(save);
				console.log(typeof save);

			}
		});

		//type here

	}


	/*
	*@method : recherche un string
	*@param {liste de string} : liste de hashtags à rechercher
	*return void
	*/
	static search(hashList) {

		trace("click & type");
		var paths = [
			'//input[@placeholder="Search"]',		// instagram
			'//input[@placeholder="Rechercher"]' 	// instagramfr
		];

		var searchfield = document.querySelector("span.TqC_a")
		console.log(searchfield)
		this.click(searchfield, function (result) {
			this.type(hashList[0], function () {
				this.press("\r", function () {
					trace("perform search");
				}.bind(this));
			}.bind(this));
		}.bind(this));

		Lazy.delay(function(){this.press("\r"),this.press("\r")}.bind(this),5000)
		state = "searched"
		return
	}

	/*
	*@method : clique sur une photo
	*@param {liste à deux eléments int} : position de la photo sur laquelle cliquer : [rangée, colonne]
	*return void
	*/
	static clickPic(picNb){
		var picture = document.querySelector("article.FyNDV");
		console.log(picture)
		picture = picture.querySelector("div").childNodes[0].childNodes[picNb[0]].childNodes[picNb[1]]
		console.log(picture)
		this.click(picture);
		state = "onPic"
		return
	}

	/*
	*@method : clique sur le bouton like de la photo
	*return void
	*/	
	static like(){
		var like_button = document.querySelector("div.eo2As ").childNodes[0].childNodes[0]
		console.log(like_button)
		this.click(like_button)
		state = "liked"
		return
	}

	/*
	*@method : clique sur le bouton close de la photo
	*return void
	*/
	static closePic(){
		let target = document.querySelector("button.ckWGn");
		console.log(target);
		this.click(target);
		state = "closed"
		return
	}

	/*
	*@method : clique sur le bouton follow et obtient le nom d'utilisateur à la liste
	*return void
	*/
	static follow(){
		var follow_button = document.body.querySelector("div").childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0]
		console.log(follow_button)
		this.click(follow_button)
		followList.push(document.body.querySelector("div").childNodes[0].childNodes[1].childNodes[0].childNodes[0].innerText)
		console.log(followList)
		state = "followed"
		return
	}
	/*
	*@method : Trouve tous les éléments repétitifs dans une liste
	*@param {array} Tableau d'éléments contenant les hashtags
	*@return array
	*/
	static hashSort(array) {
		array.forEach(function(element, idx) {
			if (array.indexOf(element, idx+1) > -1) {
				if (hashRelevant.indexOf(element) === -1)
					hashRelevant.push(element);
			}
		});
		return hashRelevant;
	}
	/*
	*@method : Recherche premièrement les hashtags sur une photo puis les sauvegarde dans une liste
	*return {string} Liste des hashtags
	*/
	static hashSearch(){
		let target =  document.body.querySelector("div.P9YgZ");
		target = target.querySelector("span");
		target = target.querySelectorAll("a");
		var j = hashFound.length;
		let fils = target;

		for(let i = 0; i< fils.length;i++) {
			if (fils[i].textContent[0] == '@')
				i++
			else
				hashFound[j++] = fils[i].innerText;
		}
		console.log(hashFound);
		state ="hashgot"
		console.log("Hashtags found")

	}


	/*
    *@method : lorsque le bot à commencé à suivre plus d'un certain nombre de personnes (ici 2), il recherche la première personne suivie et clique sur unfollow
    *@param {liste de string} : liste des personnes suivie
    *@return void
    */
	static unfollow(followList){
		if (followList.length >=2){
			let unfollow = followList.shift()
			console.log(followList)
			console.log(typeof(unfollow))
			var searchfield = document.querySelector("span.TqC_a")
			this.click(searchfield, function (result) {
			this.type(unfollow, function () {
				this.press("\r", function () {
					trace("perform search");
				}.bind(this));
			}.bind(this));
		}.bind(this));

		Lazy.delay(function(){this.press("\r"),this.press("\r")}.bind(this),5000)
		Lazy.delay(function(){this.click(follow_button)}.bind(this),10000)
		}
	}

	static trackNavigation(trackid, item, element, mutationtype, mutation) {
		trace(mutation);
	}

	static onUpdate(info) {
		return trace(info);
		if(info.hasOwnProperty("url")) {
			trace("url change");
		}
		if(info.hasOwnProperty("status") && info["status"] == "complete") {
			trace("page loaded");
		}
	}

	static fromBackground(type, message, callback) { // message from background script
		if(super.fromBackground(type, message, callback)) return true;

		//callback(); // ack to background, here or in async handler
		//return true; // to enable async callback
	}

	static fromWeb(tabid, type, message, callback) { // message from web script
		if(super.fromWeb(tabid, type, message, callback)) return true;

		//callback(); // ack to background, here or in async handler
		//return true; // to enable async callback
	}

	static fromPopup(type, message, callback) { // message from popup script
		if(super.fromPopup(type, message, callback)) return true;

		//callback(); // ack to background, here or in async handler
		//return true; // to enable async callback
	}

	static onOpenPopup() { // called when popup is opened
		super.onOpenPopup(); // do not remove

		trace("custom popup open");
		// type here
	}

	static onClosePopup() { // called when popup is closed
		super.onClosePopup(); // do not remove

		trace("custom popup close");
		// type here
	}

}

liftoff(CustomExtensionContent); // do not remove