<!--suppress ThisExpressionReferencesGlobalObjectJS -->
<h1-places-nearby>
	<!--Page heading-->
	<div class="row">
		<div class="col-md-12">
			<h1 class="h1-responsive">Places Nearby
				<small class="text-muted">Location:
					{ data.lat ? data.lat.toFixed(6) : 'unknown' },
					{ data.lon ? data.lon.toFixed(6) : 'unknown' }</small>
			</h1>
		</div>
	</div>
	<!--/.Page heading-->

	<script>
		//riot.observable(this);

		const store = require('./storeFactory').default;
//		const store2 = require('./storeFactory').default;
//		console.log(store);
//		console.log(store2);
//		console.log(store === store2);
		//console.log('state in h1', store.getState());

		this.data = {
			lat: null,
			lon: null,
		};

		//console.log(this);

		const unsubscribe = store.subscribe(() => {
			let gps = store.getState().gps;
			if (gps &&
				gps.lat() !== this.lat &&
				gps.lon() !== this.lon) {
				//console.log('h1-places-nearby->gps', store.getState());
				this.data.lat = gps.lat();
				this.data.lon = gps.lon();
				this.update();
			}
		});

		this.on('mount', () => {
			//console.log('mounted h1');
			let state = store.getState();
			if (state) {
				let gps = state.gps;
				if (gps) {
					this.data.lat = gps.lat();	// should trigger update()
					this.data.lon = gps.lon();
					//console.log('state copied in mount');
					this.update();
				}
			}
		});

		this.on('unmount', () => {
			unsubscribe();
		});

	</script>
</h1-places-nearby>
