/**
 * @nocollapse
 * @extends {AutoContentScript}
 * @final
 */
var save = null;
var state = "begin"
var followList = ["sissymua"]
var hashtag_list = ["ag_photographe"]
var hashtag_list_temp = [];

class CustomExtensionContent extends AutoContentScript {

	constructor() {
		super(); // useless, for closure compiler
	}

	static initialized() { // content script is linked to background, ready
		// no super call, override only

		trace(this.name, "custom init");
		const target = document.querySelector("nav");

		//type here

		(async () => {
			const el = this
			for(let i = 0; i<10; i++){
				await el.hashSort(hashtag_list_temp)
				await el.search(hashtag_list[i])    // async call
				await el.sleep(5000)

				let nbPicsToLike = 3;
				let followOrNot = this.getRandomIntInclusive(0,10)
				var pic_list = new Array(nbPicsToLike)
				for (let i = 0; i<nbPicsToLike; i++){
					pic_list[i] = new Array(2)
					pic_list[i][0] = this.getRandomIntInclusive(0,3);
					pic_list[i][1] = this.getRandomIntInclusive(0,2)
				}

				while (pic_list.length >0){
					let pic = pic_list.shift()
					await el.clickPic(pic)  // async call
					await el.sleep(8000)
					await el.like()    // async call
					await el.hashSearch()
					await el.sleep(1000)
					await el.closePic()    // async call
					await el.sleep(2000)
					console.log(hashtag_list)
				}

				console.log(followOrNot)
				if (followOrNot>5){
					await el.follow()
					await el.unfollow()
				}
				await el.search(hashtag_list)   // async call
			}
		})()
	}

	/*
	*@method : Donne un entier aléatoire
	*@param {int int} : Deux entiers min et max
	*return int
	*/
	static getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min +1)) + min;
	}

	/*
	*@method : Effectue un sleep pour effectuer une attente
	*@param {int} : nombre de secondes qui sera passé dans Lazy.delay
	*return new promise resolve
	*/
	static sleep(time){
		return new Promise((resolve, reject)=>{
			Lazy.delay(function(){resolve()},time)
		})
	}

	/*
	*@method : recherche un string
	*@param {liste de string} : liste de hashtags à rechercher
	*return new promise resolve
	*/
	static search(hashtag) {
		return new Promise((resolve, reject)=>{
			trace("click & type");
			var paths = [
				'//input[@placeholder="Search"]',		// instagram
				'//input[@placeholder="Rechercher"]' 	// instagramfr
			];

			var searchfield = document.querySelector("span.TqC_a")
			console.log(searchfield)
			this.click(searchfield, function (result) {
				this.type(hashtag, function () {
					this.press("\r", function () {
						trace("perform search");
					}.bind(this));
				}.bind(this));
			}.bind(this));

			Lazy.delay(function(){this.press("\r"),this.press("\r"),resolve()}.bind(this),5000)
			state = "searched"
		})

	}

	/*
	*@method : clique sur une photo
	*@param {liste à deux eléments int} : position de la photo sur laquelle cliquer : [rangée, colonne]
	*return new promise resolve
	*/
	static clickPic(picNb){
		return new Promise((resolve, reject)=>{
			var picture = document.querySelector("article.FyNDV");
			console.log(picture)
			picture = picture.querySelector("div").childNodes[0].childNodes[picNb[0]].childNodes[picNb[1]]
			console.log(picture)
			this.click(picture);
			state = "onPic"
			resolve()
		})
	}

	/*
	*@method : clique sur le bouton like de la photo
	*return new promise resolve
	*/
	static like(){
		return new Promise((resolve, reject)=>{
			var like_button = document.querySelector("div.eo2As ").childNodes[0].childNodes[0]
			console.log(like_button)
			this.click(like_button)
			state = "liked"
			resolve()
		})
	}

	/*
	*@method : clique sur le bouton close de la photo
	*return new promise resolve
	*/
	static closePic(){
		return new Promise((resolve,reject)=>{
			let target = document.querySelector("button.ckWGn");
			console.log(target);
			this.click(target);
			state = "closed"
			resolve()
		})
	}

	/*
	*@method : clique sur le bouton follow et obtient le nom d'utilisateur à la liste
	*return new promise resolve
	*/
	static follow(){
		return new Promise((resolve, reject)=>{
			var follow_button = document.body.querySelector("div").childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0]
			console.log(follow_button)
			this.click(follow_button)
			followList.push(document.body.querySelector("div").childNodes[0].childNodes[1].childNodes[0].childNodes[0].innerText)
			console.log(followList)
			state = "followed"
			resolve()
		})
	}

	/*
	*@method : Trouve tous les éléments repétitifs dans une liste
	*@param {array} Tableau d'éléments contenant les hashtags
	*@return new promise resolve
	*/
	static hashSort(hashtag_list_temp) {
		return new Promise((resolve, reject)=>{
			let result= [];
			// Si notre liste est inférieur à 2 éléments inutile de la trier
			if(hashtag_list_temp.length>2){
				hashtag_list_temp.forEach(function(element, idx) {
					if (hashtag_list_temp.indexOf(element, idx+1) > -1) {
						if (result.indexOf(element) === -1)
							result.push(element);
					}
				});hashtag_list = result;}
			resolve()
			;})
	}

	/*
	*@method : Recherche premièrement les hashtags sur une photo puis les sauvegarde dans une liste
	*return new promise resolve
	*/
	static hashSearch(){
		return new Promise((resolve, reject)=>{
			let target =  document.body.querySelector("div.P9YgZ");
			target = target.querySelector("span");
			target = target.querySelectorAll("a");
			var j = hashtag_list.length;
			let fils = target;
			if(fils.length>2)
			for(let i = 0; i< fils.length;i++) {
				if (fils[i].textContent[0] == '@')
					continue
				else
					hashtag_list[j++] = fils[i].innerText;
			}

			hashtag_list_temp = hashtag_list;
			state ="hashfound"
			console.log("Hashtags found")
			resolve()
		})
	}

	/*
    *@method : lorsque le bot à commencé à suivre plus d'un certain nombre de personnes (ici 2), il recherche la première personne suivie et clique sur unfollow
    *@param {liste de string} : liste des personnes suivie
    *@return new promise resolve
    */
	static unfollow(followList){
		return new Promise((resolve, reject)=>{
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
				Lazy.delay(function(){this.click(follow_button),resolve()}.bind(this),10000)
			}
		})
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
