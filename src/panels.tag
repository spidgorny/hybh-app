<!--suppress ThisExpressionReferencesGlobalObjectJS -->
<panels>
	<!--First row-->
	<div class="row">
		<!--First column-->
		<div class="col-lg-4">
			<!--Card-->
			<card></card>
		</div>
	</div>

	<script>
		this.panels = {};

		this.updatePanels = (pages) => {
			this.panels = pages;
			console.log(this.panels);
		};
	</script>

</panels>
