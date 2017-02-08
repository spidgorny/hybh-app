<raw>
	<span>
		<yield/>
	</span>

	<script>
		console.log('raw', this);
		this.root.innerHTML = opts.content;
	</script>
</raw>
