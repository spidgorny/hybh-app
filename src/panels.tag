<!--suppress ThisExpressionReferencesGlobalObjectJS -->
<panels>
	<!--First row-->
	<div class="row">
		<!--First column-->
		<div class="col-lg-4">
			<!--Card-->
			<card each="{ p, id in panels }"
				  data="{ p }"
				  id="{ id }"
				  title="{ this.title }"
				  lat="{ parent.gps ? parent.gps.lat() : '' }"
				  lon="{ parent.gps ? parent.gps.lon() : '' }"
			></card>
		</div>
	</div>

	<script>
		const store = require('./storeFactory').default;

		this.gps = null;
		this.panels = {};

		this.setGPS = (gps) => {
			console.log('panels.setGPS', gps);
			this.gps = gps;
		};

		this.updatePanels = (pages) => {
			this.panels = pages;
			console.log(this.panels);
			this.update();
		};

		const unsubscribe = store.subscribe(() => {
			let places = store.getState().placesNearby;
			if (places && places != this.panels) {
				console.log('panels->places', store.getState());
				this.panels = places;
				this.gps = store.getState().gps;
				console.log(this.gps);
				this.update();
			}
		});

		this.on('unmount', () => {
			unsubscribe();
		});

	</script>

</panels>
