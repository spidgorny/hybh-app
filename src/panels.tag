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
		require('./Object.filter');

		this.gps = null;
		this.panels = {};

		this.setGPS = (gps) => {
			console.log('panels.setGPS', gps);
			this.gps = gps;
		};

		this.updatePanels = (pages) => {
			let forget = store.getState().forget;
			pages = Object.filter(pages, (el) => {
				return -1 !== forget.indexOf(el.pageid);
			});
			this.panels = pages;
			//console.log('updatePanels', this.panels);
			this.update();
		};

		const unsubscribe = store.subscribe(() => {
			let places = store.getState().placesNearby;
			if (places && places != this.panels) {
				//console.log('panels->places', store.getState());
				this.panels = places;
				this.gps = store.getState().gps;
				//console.log(this.gps);
				this.update();
			}
		});

		this.on('mount', () => {
			let state = store.getState();
			//console.log('panels.mount', state);
			this.gps = state.gps;
			this.updatePanels(state.placesNearby);
		});

		this.on('unmount', () => {
			unsubscribe();
		});

	</script>

</panels>
