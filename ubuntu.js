(function() {
	var button = document.querySelector('button'),
		mirror = document.querySelector('select[name=mirror]'),
		arch = document.querySelector('select[name=arch]'),
		releases = document.querySelector('select[name=releases]'),
		list = document.querySelector('textarea[name=list]'),
		src = document.querySelector('input[name=src]'),
		restricted = document.querySelector('input[name=restricted]'),
		universe = document.querySelector('input[name=universe]'),
		multiverse = document.querySelector('input[name=multiverse]'),
		firefox = document.querySelector('input[name=firefox]'),
		apache2 = document.querySelector('input[name=apache2]'),
		php = document.querySelector('input[name=php]'),
		nginx = document.querySelector('input[name=nginx]'),
		mariadb = document.querySelector('input[name=mariadb]'),
		mysql = document.querySelector('input[name=mysql]'),
		security = document.querySelector('input[name=security]');

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
                var ftpf = [ftp+'/ubuntu/'];

		var comps = getComponents();
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
			appendSource(['echo "deb', arch, ftpf, rel + '-security', comps+'" | sudo tee -a /etc/apt/sources.list > /dev/null']);
			if(src.checked) appendSource(['echo "deb-src', arch, ftpf, rel + '-security', comps+'" | sudo tee -a /etc/apt/sources.list > /dev/null']);
		}

		appendSource(['sudo apt-get update']);
		appendSource(['sudo apt-get install curl wget apt-transport-https dirmngr gnupg2 ca-certificates lsb-release ubuntu-keyring software-properties-common -y']);
			appendSource(['sudo install -d -m 0755 /etc/apt/keyrings']);

		if(firefox.checked) {
			appendSource(['mkdir -p ~/.mozilla/firefox/ && cp -a ~/snap/firefox/common/.mozilla/firefox/* ~/.mozilla/firefox/']);
			appendSource(['sudo snap remove firefox']);
			appendSource(['sudo apt-get -y purge firefox']);
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
			appendSource(['sudo add-apt-repository ppa:ondrej/apache2 -y']);
			if(src.checked) appendSource(['sudo add-apt-repository ppa:ondrej/apache2 -y -s']);
		}
		if(php.checked) {
			appendSource(['sudo add-apt-repository ppa:ondrej/php -y']);
			if(src.checked) appendSource(['sudo add-apt-repository ppa:ondrej/php -y -s']);
		}
		if(nginx.checked) {
			appendSource(['wget -q https://nginx.org/keys/nginx_signing.key -O- | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg > /dev/null']);
			appendSource(['echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg]', arch, 'http://nginx.org/packages/ubuntu/', rel, 'main'+ '" | sudo tee -a /etc/apt/sources.list.d/nginx.list > /dev/null']);
			if(src.checked) appendSource(['echo "deb-src [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg]', arch, 'http://nginx.org/packages/ubuntu/', rel, 'main'+ '" | sudo tee -a /etc/apt/sources.list.d/nginx.list > /dev/null']);
		}
		if(mariadb.checked) {
			appendSource(['wget -q https://mariadb.org/mariadb_release_signing_key.pgp -O- | sudo tee /etc/apt/keyrings/mariadb-keyring.pgp > /dev/null']);
			appendSource(['echo "deb [signed-by=/etc/apt/keyrings/mariadb-keyring.pgp]', arch, 'https://mirror.mariadb.org/repo/11.2/ubuntu/', rel, 'main'+ '" | sudo tee -a /etc/apt/sources.list.d/mariadb.list > /dev/null']);
			if(src.checked) appendSource(['echo "deb-src [signed-by=/etc/apt/keyrings/mariadb-keyring.pgp]', arch, 'https://mirror.mariadb.org/repo/11.2/ubuntu/', rel, 'main'+ '" | sudo tee -a /etc/apt/sources.list.d/mariadb.list > /dev/null']);
		}
		if(mysql.checked) {
			appendSource(['wget -q "https://dev.mysql.com/get/mysql-apt-config_0.8.29-1_all.deb" -O mysql-apt-config_0.8.29-1_all.deb']);
			appendSource(['sudo dpkg -i mysql-apt-config_0.8.29-1_all.deb']);
			appendSource(['sudo apt-get update']);
			appendSource(['sudo apt-get -yf install']);
			appendSource(['rm -f mysql-apt-config_0.8.29-1_all.deb']);
		}





		
		appendSource(['sudo apt update']);

		list.value = sourceList.join("\n");
		sourceList = [];
	};

	button.addEventListener('click', generate, false);
	generate();
})();
