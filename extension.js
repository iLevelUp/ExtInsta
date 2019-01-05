/**
* @nocollapse
* @extends {AutoContentScript}
* @final
*/
var save = null;
//var state = "begin"
var follow_list = ["sissymua"]
var hashtag_list = ["helloworld"]
class CustomExtensionContent extends AutoContentScript {

	constructor() {
		super(); // useless, for closure compiler
	}

	static initialized() { // content script is linked to background, ready
		// no super call, override only

		trace(this.name, "custom init");
		const target = document.querySelector("nav");
		Observer.watch(target, {attributes : true, characterData: true, childList: true, subtree: true},function

			callback(watchid, item, element, mutationtype, mutation) {
				if(mutationtype == 'childList') {
					if(mutation.addedNodes = "NodeList [div]")
					save = mutation.addedNodes;
					//save = save.childNodes;
					console.log(save);
					console.log(typeof save);

				}});

		//type functions here

	}
	
	/*
	*@method : recherche un string
	*@param {liste de string} : liste de hashtags à rechercher
	*return void
	*/
	static search(hashtag_list) {

		trace("click & type");
		var paths = [
			'//input[@placeholder="Search"]',		// instagram
			'//input[@placeholder="Rechercher"]' 	// instagramfr
		];

		var searchfield = document.querySelector("span.TqC_a")
		console.log(searchfield)
		this.click(searchfield, function (result) {
			this.type(hashtag_list[0], function () {
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
	static click_picture(pic_number){
		var picture = document.querySelector("article.FyNDV");
		console.log(picture)
		picture = picture.querySelector("div").childNodes[0].childNodes[pic_number[0]].childNodes[pic_number[1]]
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
		state = "Liked"
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
		follow_list.push(document.body.querySelector("div").childNodes[0].childNodes[1].childNodes[0].childNodes[0].innerText)
		console.log(follow_list)
		state = "followed"
		return
	}

	/*
	*@method : lorsque le bot à commencé à suivre plus d'un certain nombre de personnes (ici 2), il recherche la première personne suivie et clique sur unfollow
	*@param {liste de string} : liste des personnes suivie
	*@return void
	*/
	static unfollow(follow_list){
		if (follow_list.length >=2){
			let unfollow = follow_list.shift()
			console.log(follow_list)
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