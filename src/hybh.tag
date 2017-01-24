<hybh>
	<h1-places-nearby></h1-places-nearby>

	<hr>

	<panels ref="panels"></panels>

	<script>
		this.gps = null;

		this.updatePanels = (pages) => {
			this.refs.panels.setGPS(this.gps);	// if already defined
			this.refs.panels.updatePanels(pages);
		};

		this.setGPS = (latlon) => {
			console.log('hybh.setGPS', latlon);
			this.gps = latlon;
		};
	</script>
</hybh>
