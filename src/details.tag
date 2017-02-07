<details>

	<h1>{ data.title }
		<small>{ opts.id }</small>
	</h1>

	<script>

		this.data = {
			title: 'temp title',
		};

		const store = require('./storeFactory').default;
		console.log('store', store);
		console.log('state', store.getState());

		this.on('mount', () => {
			console.log('mount details', this);
		});

		this.setID = (id) => {
			this.opts.id = id;
			console.log(this.opts);
			this.update();
		};

		this.on('update', () => {
			let state = store.getState();
			console.log('state from store', state);
			if (state && 'placesNearby' in state) {
				let places = state.placesNearby;
				console.log('update details places', places);
				if (this.opts.id > 0) {
					this.data = places[this.opts.id];
					this.update();
				} else {
					console.error('this.opts.id is not a number');
				}
			} else {
				console.log('state without placesNearby');
			}
		});

		this.on('unmount', () => {
		});


	</script>

</details>
