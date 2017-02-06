<!--suppress ThisExpressionReferencesGlobalObjectJS -->
<h1-places-nearby>
	<!--Page heading-->
	<div class="row">
		<div class="col-md-12">
			<h1 class="h1-responsive">Places Nearby
				<small class="text-muted">Location:
					{ lat || 'unknown' }, { lon || 'unknown' }</small>
			</h1>
		</div>
	</div>
	<!--/.Page heading-->

	<script>
		//riot.observable(this);

		const store = require('./storeFactory').default;

		this.lat = null;
		this.lon = null;

		//console.log(this);

		const unsubscribe = store.subscribe(() => {
			let gps = store.getState().gps;
			if (gps && gps.lat() != this.lat && gps.lon() != this.lon) {
				console.log('h1-places-nearby->gps', store.getState());
				this.lat = gps.lat();
				this.lon = gps.lon();
				this.update();
			}
		});

		this.on('mount', () => {
			console.log('mounted h1');
		});

		this.on('unmount', () => {
			unsubscribe();
		});

	</script>
</h1-places-nearby>
