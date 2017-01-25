<card>
	<div class="card">

		<!--Card image-->
		<div class="view overlay hm-white-slight">
			<img src="{ data.thumbnail ? data.thumbnail.source : '' }" class="img-fluid" alt="">
			<a href="#details/{ data.pageid }">
				<div class="mask"></div>
			</a>
		</div>
		<!--/.Card image-->

		<!--Card content-->
		<div class="card-block">
			<!--Title-->
			<h4 class="card-title">
				<div style="float: right"> { distance || '?' } km</div>
				{ data.title }
			</h4>
			<!--Text-->
			<p class="card-text">
				{ data.terms ? data.terms.description : ''}</p>
			<div class="read-more">
				<a href="#details/{ data.pageid }" class="btn btn-primary">Read more</a>
			</div>
		</div>
		<!--/.Card content-->

	</div>
	<!--/.Card-->

	<script>
		const LatLon = require('mt-latlon');
		const store = require('./storeFactory').default;

		this.data = this.opts.data;
		this.gps = new LatLon(this.opts.lat, this.opts.lon);

		if (this.gps) {
			let coordinates = this.data.coordinates[0];
			let point = new LatLon(coordinates.lat, coordinates.lon);
			this.distance = point.distanceTo(this.gps);
		}

		console.log(this);

	</script>

</card>
