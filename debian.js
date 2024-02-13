(function() {
	var button = document.querySelector('button'),
		mirror = document.querySelector('select[name=mirror]'),
		arch = document.querySelector('select[name=arch]'),
		releases = document.querySelector('select[name=releases]'),
		list = document.querySelector('textarea[name=list]'),
		src = document.querySelector('input[name=src]'),
		contrib = document.querySelector('input[name=contrib]'),
		nonfree = document.querySelector('input[name=non-free]'),
		nonfreefirmware = document.querySelector('input[name=non-free-firmware]'),
		firefox = document.querySelector('input[name=firefox]'),
		apache2 = document.querySelector('input[name=apache2]'),
		php = document.querySelector('input[name=php]'),
		security = document.querySelector('input[name=security]');

	var sourceList = [];

	var getComponents = function() {
		var components = ['main'];

		if(contrib.checked) components.push('contrib');
		if(nonfree.checked) components.push('non-free');
		if(nonfreefirmware.checked) components.push('non-free-firmware');

		return components.join(' ');
	};

        var getComponentss = function() {
                var componentss = ['main'];

                componentss.push('updates');
                if(nonfree.checked) componentss.push('non-free');

                return componentss.join(' ');
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
                var ftpf = [ftp+'/debian/'];
		var ftps = [ftp+'/debian-security/'];

		var comps = getComponents();
		var compss = getComponentss();
		var arch = getArch();

		appendSource(['sudo rm -f /etc/apt/sources.list']);
		appendSource(['sudo rm -f /etc/apt/sources.list.d/*.list']);
		appendSource(['echo "deb', arch, ftpf, rel, comps+'" | sudo tee -a /etc/apt/sources.list > /dev/null']);
		if(src.checked) appendSource(['echo "deb-src', arch, ftpf, rel, comps+'" | sudo tee -a /etc/apt/sources.list > /dev/null']);

		if(releases.options[releases.selectedIndex].hasAttribute('data-updates')) {
			//appendSource(['']);
			appendSource(['echo "deb', arch, ftpf, rel + '-updates', comps+'" | sudo tee -a /etc/apt/sources.list > /dev/null']);
			if(src.checked) appendSource(['echo "deb-src', arch, ftpf, rel + '-updates', comps+'" | sudo tee -a /etc/apt/sources.list > /dev/null']);
		}

		if(security.checked) {
			//appendSource(['']);
			appendSource(['echo "deb', arch, ftps, rel + '-security', compss+'" | sudo tee -a /etc/apt/sources.list > /dev/null']);
			if(src.checked) appendSource(['echo "deb-src', arch, ftps, rel + '-security', compss+'" | sudo tee -a /etc/apt/sources.list > /dev/null']);
		}

		appendSource(['sudo apt-get update']);
		appendSource(['sudo apt-get install curl wget apt-transport-https dirmngr ca-certificates -y']);

		if(firefox.checked) {
			appendSource(['mkdir -p ~/.mozilla/firefox/ && cp -a ~/snap/firefox/common/.mozilla/firefox/* ~/.mozilla/firefox/']);
			appendSource(['sudo snap remove firefox']);
			appendSource(['sudo apt-get -y purge firefox']);
			appendSource(['sudo install -d -m 0755 /etc/apt/keyrings']);
			appendSource(['wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | sudo tee /etc/apt/keyrings/packages.mozilla.org.asc > /dev/null']);
			appendSource(['echo "deb [signed-by=/etc/apt/keyrings/packages.mozilla.org.asc]', arch, 'https://packages.mozilla.org/apt', 'mozilla', 'main'+ '" | sudo tee -a /etc/apt/sources.list.d/mozilla.list > /dev/null']);
			appendSource(['echo "']);
			appendSource(['Package: *']);
			appendSource(['Pin: origin packages.mozilla.org']);
			appendSource(['Pin-Priority: 1000']);
			appendSource(['" | sudo tee /etc/apt/preferences.d/mozilla']);
			appendSource(['sudo apt-get update']);
			appendSource(['sudo apt-get -y install firefox']);
		}

		if(apache2.checked) {
			appendSource(['sudo install -d -m 0755 /etc/apt/keyrings']);
			appendSource(['wget -q https://packages.sury.org/apache2/apt.gpg -O- | sudo tee /etc/apt/keyrings/apache2.asc > /dev/null']);
			appendSource(['echo "deb [signed-by=/etc/apt/keyrings/apache2.asc]', arch, 'https://packages.sury.org/apache2/', rel, 'main'+ '" | sudo tee -a /etc/apt/sources.list.d/apache2.list > /dev/null']);
			if(src.checked) appendSource(['echo "deb-src [signed-by=/etc/apt/keyrings/apache2.asc]', arch, 'https://packages.sury.org/apache2/', rel, 'main'+ '" | sudo tee -a /etc/apt/sources.list.d/apache2.list > /dev/null']);
			appendSource(['sudo apt update']);
		}
		if(php.checked) {
			appendSource(['sudo install -d -m 0755 /etc/apt/keyrings']);
			appendSource(['wget -q https://packages.sury.org/php/apt.gpg -O- | sudo tee /etc/apt/keyrings/php.asc > /dev/null']);
			appendSource(['echo "deb [signed-by=/etc/apt/keyrings/php.asc]', arch, 'https://packages.sury.org/php/', rel, 'main'+ '" | sudo tee -a /etc/apt/sources.list.d/php.list > /dev/null']);
			if(src.checked) appendSource(['echo "deb-src [signed-by=/etc/apt/keyrings/php.asc]', arch, 'https://packages.sury.org/php/', rel, 'main'+ '" | sudo tee -a /etc/apt/sources.list.d/php.list > /dev/null']);
			appendSource(['sudo apt update']);
		}

		list.value = sourceList.join("\n");
		sourceList = [];
	};

	button.addEventListener('click', generate, false);
	generate();
})();
