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
		this.wikipediaURL = 'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates%7Cpageimages%7Cpageterms&colimit=50&piprop=thumbnail&pithumbsize=144&pilimit=50&wbptterms=description&generator=geosearch&ggscoord=50.15%7C8.7&ggsradius=10000&ggslimit=50&format=json';

		this.lat = null;
		this.lon = null;

		console.log(this);

		this.on('mount', () => {
			console.log('mounted');
			GMaps.geolocate({
				success: this.geolocated
			});
		});

		this.geolocated = (pos) => {
			console.log(pos);
			this.lat = pos.coords.latitude;
			this.lon = pos.coords.longitude;
			this.update();
		}

	</script>
</h1-places-nearby>
