(function() {
	var button = document.querySelector('button'),
		mirror = document.querySelector('select[name=mirror]'),
		arch = document.querySelector('select[name=arch]'),
		releases = document.querySelector('select[name=releases]'),
		list = document.querySelector('textarea[name=list]'),
		src = document.querySelector('input[name=src]'),
		contrib = document.querySelector('input[name=restricted]'),
		nonfree = document.querySelector('input[name=multiverse]'),
		security = document.querySelector('input[name=universe]');

	var sourceList = [];

	var getComponents = function() {
		var components = ['main'];

		if(restricted.checked) components.push('restricted');
		if(universe.checked) components.push('universe');
		if(multiverse.checked) components.push('multiverse');

		return components.join(' ');
	};

	var getArch = function() {
		var value = arch.options[arch.selectedIndex].value;
		return value ? '[arch=' + value + ']' : '';
	};

	var appendSource = function(source) {
		sourceList.push(source.filter(function(element) { return element.length; }).join(' '));
	};

	var generate = function() {
		var ftp = mirror.options[mirror.selectedIndex].value,
			rel = releases.options[releases.selectedIndex].value;

		var comps = getComponents();
		var arch = getArch();

		appendSource(['deb', arch, ftp, rel, comps]);
		if(src.checked) appendSource(['deb-src', arch, ftp, rel, comps]);

		if(releases.options[releases.selectedIndex].hasAttribute('data-updates')) {
			appendSource(['']);
			appendSource(['deb', arch, ftp, rel + '-updates', comps]);
			if(src.checked) appendSource(['deb-src', arch, ftp, rel + '-updates', comps]);
		}

		list.value = sourceList.join("\n");
		sourceList = [];
	};

	button.addEventListener('click', generate, false);
	generate();
})();

