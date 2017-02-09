/**
 * Created by DEPIDSVY on 09.02.2017.
 */

export default class ScrollWatch {

	history = [];

	route;

	constructor(route) {
		this.route = route;
	}

	/**
	 * we can not distinguish route going back so we don't use
	 * automatic saving and restoring.
	 * @deprecated
	 */
	start() {
		// not called because it's SPA
		document.addEventListener('beforeunload', () => {
			// this.saveScroll();
		});
		this.route((p1, p2, p3) => {
			console.log(p1, p2, p3);
			//this.saveScroll();
		});

		// this runs too early
		window.addEventListener('popstate', () => {
			// this runs too soon, but we will call it manually in mount
			//setTimeout(() => {
			//	this.restoreScroll();
			//}, 10);	// to allow route to mount
		})
	}

	saveScroll() {
		this.history.push(window.scrollY);
		console.log('saveScroll', this.history);
	}

	restoreScroll() {
		console.log('restoreScroll', this.history);
		if (this.history.length) {
			let scroll = this.history.pop();
			window.scrollTo(0, scroll);
		}
	}

}
