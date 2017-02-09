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
				<div class="btn-group">
					<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<i class="fa fa-ellipsis-v"></i>
					</button>

					<div class="dropdown-menu dropdown-menu-right">
						<a class="dropdown-item { data.isForgotten ? 'disabled' : '' }" onclick="{ forget }">
							Forget - never notify about this place again.
						</a>
					</div>
				</div>
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
		this.store = require('./storeFactory').default;
//		console.log('store in details', this.store);
//		console.log('state in details', this.store.getState());

		this.on('mount', () => {
			//console.log('mount details', this);
		});

		this.setID = (id) => {
//			this.opts.id = id;
//			this.opts.some = 'shit';
			//console.log('setID(', id, ')', this.opts);
			let state = this.store.getState();

			//console.log('state from store', state);
			if (state && 'placesNearby' in state) {
				let places = state.placesNearby;
//				console.log('update details places', places);
				if (id in places) {
					this.data = places[id];
					this.update();
				}
			} else {
				console.warn('state without placesNearby');
			}
		};

		this.on('update', () => {
//			console.log('details.update()', this.data);

			if (this.data) {
				let state = this.store.getState();
				let gps = state.gps;

				if (gps) {
					let coordinates = this.data.coordinates[0];
					let point = new LatLon(coordinates.lat, coordinates.lon);
					this.distance = point.distanceTo(gps);
				}
			}

			this.root.querySelector('raw').innerHTML = this.data.extract || '';
			this.data.isForgotten = this.isForgotten();
		});

		this.on('unmount', () => {
		});

		this.forget = (e) => {
//			console.log('forget', this.data.pageid);
//			console.log(e.target);
			this.store.dispatch({
				type: 'forgetPlace',
				pageid: this.data.pageid,
			});
		};

		this.isForgotten = () => {
//			console.log('isForgotten', this.data.pageid);
			let state = this.store.getState();
			let indexOf = state.forget.indexOf(this.data.pageid);
//			console.log(indexOf, state.forget);
			return -1 !== indexOf;
		};

	</script>

</details>
