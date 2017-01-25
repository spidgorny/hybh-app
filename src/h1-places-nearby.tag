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

		const LatLon = require('mt-latlon');
		const gl = require('./GMaps.geolocate.js');
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

				let wikipediaURL = this.getWikipediaURL();
				console.log(wikipediaURL);
				this.fetchJSON(wikipediaURL);
			}
		});

		this.getWikipediaURL = () => {
			return 'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates%7Cpageimages%7Cpageterms%7Cdistance&colimit=50&piprop=thumbnail&pithumbsize=708&pilimit=50&wbptterms=description&generator=geosearch&ggscoord='+this.lat+'%7C'+this.lon+'&ggsradius=1000&ggslimit=50&format=json&origin=*';
			//+encodeURIComponent('http://localhost:8081');
		};

		this.on('mount', () => {
			//console.log('mounted');
			GMaps.geolocate({
				success: this.geolocated
			});
		});

		this.geolocated = (pos) => {
			//console.log(pos);
//			this.lat = pos.coords.latitude;
//			this.lon = pos.coords.longitude;
			const latLon = new LatLon(pos.coords.latitude, pos.coords.longitude);
			store.dispatch({
				type: 'setGPS',
				latLon: latLon,
			});
			//this.parent.setGPS(latLon);

			if (false) {
				let wikipediaURL = this.getWikipediaURL();
				//console.log(wikipediaURL);
				this.fetchJSON(wikipediaURL);
			}
		};

		this.fetchJSON = (url) => {
			fetch(url, {
//				mode: 'no-cors',
				cache: 'force-cache',
				headers: {
//					'Origin': 'http://localhost:8081'
				},
			})
			.then(response => {
				return response.text();
//				return response.json();
			})
			.then(text => {
				return JSON.parse(text);
			})
			.then(json => {
				this.updatePanels(json.query.pages);
			})
			.catch(err => {
				console.log(err);
			});
		};

		this.updatePanels = (pages) => {
			//console.log(this.parent);
			//this.parent.updatePanels(pages);
			store.dispatch({
				type: 'setPlaces',
				places: pages,
			});
		};

		this.on('unmount', () => {
			unsubscribe();
		});

	</script>
</h1-places-nearby>
