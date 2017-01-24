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
				  lat="{ parent.gps.lat() }"
				  lon="{ parent.gps.lon() }"
			></card>
		</div>
	</div>

	<script>
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
	</script>

</panels>
