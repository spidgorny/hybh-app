<hybh>
	<h1-places-nearby></h1-places-nearby>

	<hr>

	<panels ref="panels">

	</panels>

	<script>
		//console.log(this.opts);
		this.scrollWatch = this.opts.scrollWatch;
		this.type = 'hybh';

		/**
		 * To be executed after rendering but only once
		 * @type {boolean}
		 */
		this.pleaseRestoreScroll = false;

		this.on('mount', () => {
			console.log('hybh mount');
			// it's too early here
			//this.scrollWatch.restoreScroll();
			this.pleaseRestoreScroll = true;
		});

		this.on('update', () => {
			console.log('hybh update');
		});

		/**
		 * This is never called!?!
		 */
		this.on('updated', () => {
			console.log('hybh updated');
			///if (this.pleaseRestoreScroll) {
				this.scrollWatch.restoreScroll();
				this.pleaseRestoreScroll = false;
			//}
		});

		this.on('before-unmount', () => {
			console.log('hybh before-unmount');
			// does not work as it stores 0 all the time
			// it has to be called in the router
			// this.scrollWatch.saveScroll();
		});

		this.afterMount = () => {
			console.log('hybh afterMount');
			this.scrollWatch.restoreScroll();
		};

	</script>
</hybh>
