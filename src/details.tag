<details>

	<div class="card card-block">
		<h4 class="card-title">

			<div style="float: right"> { distance || '?' } km</div>
			{ data.title }
			<small>{ data.pageid }</small>

		</h4>

		<img src="{ data.thumbnail ? data.thumbnail.source : '' }" class="img-fluid" alt="">

		<p class="card-text">
			<raw>
				{ parent.data.extract ? parent.data.extract : ''}
			</raw>
		</p>

		<div class="flex-row clearfix">
			<a href="{ data.canonicalurl || data.fullurl }" class="btn btn-primary">Read more</a>

			<div style="float: right">
				<button onclick="{ forget }">Forget</button> - never notify about this place again.
			</div>

			<!--<a class="card-link">Another link</a>-->
		</div>
	</div>

	<script>
		const raw = require('./raw.tag');

		this.data = {
			title: 'temp title',
		};
		this.distance = null;

		const LatLon = require('mt-latlon');
		const store = require('./storeFactory').default;
		console.log('store in details', store);
		console.log('state in details', store.getState());

		this.on('mount', () => {
			console.log('mount details', this);
		});

		this.setID = (id) => {
//			this.opts.id = id;
//			this.opts.some = 'shit';
			console.log('setID(', id, ')', this.opts);
			let state = store.getState();

			console.log('state from store', state);
			if (state && 'placesNearby' in state) {
				let places = state.placesNearby;
				console.log('update details places', places);
				if (id in places) {
					this.data = places[id];
					this.update();
				}
			} else {
				console.log('state without placesNearby');
			}
		};

		this.on('update', () => {
			console.log('details.update()', this.data);

			if (this.data) {
				let state = store.getState();
				let gps = state.gps;

				if (gps) {
					let coordinates = this.data.coordinates[0];
					let point = new LatLon(coordinates.lat, coordinates.lon);
					this.distance = point.distanceTo(gps);
				}
			}

			this.root.querySelector('raw').innerHTML = this.data.extract || '';
		});

		this.on('unmount', () => {
		});

		this.forget = (e) => {
			console.log('forget', this.data.pageid);
			console.log(e.target);
			store.dispatch({
				type: 'forgetPlace',
				pageid: this.data.pageid,
			});
		}

	</script>

</details>
