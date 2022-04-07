# -*- mode: ruby -*-
# vi: set ft=ruby :
box      = 'debian/contrib-stretch64'

# VM configuration
vm_hostname = 'open-loyalty'
vm_ram      = '3072'
vm_cpus     = 2
vm_pae      = 'on'
vm_ioapic   = 'on'
vm_natdnshostresolver1   = 'on'
vm_natdnsproxy1   = 'on'

Vagrant.require_version ">= 1.9.1"

Vagrant.configure("2") do |config|
  config.vm.box = box
  config.ssh.forward_agent = true

  config.vm.define 'vm' do |node|
      node.vm.provider "virtualbox" do |v|
          v.customize [
              "modifyvm", :id,
              "--name", vm_hostname,
              "--memory", vm_ram,
              "--cpus", vm_cpus,
              "--pae", vm_pae,
              "--ioapic", vm_ioapic,
              "--natdnshostresolver1", vm_natdnshostresolver1,
              "--natdnsproxy1", vm_natdnsproxy1
          ]
      end

      node.vm.network "forwarded_port", guest: 80, host: 80
      node.vm.network "forwarded_port", guest: 8182, host: 8182
      node.vm.network "forwarded_port", guest: 8183, host: 8183
      node.vm.network "forwarded_port", guest: 8184, host: 8184
      node.vm.network "forwarded_port", guest: 8186, host: 8186
      node.vm.hostname = vm_hostname

      node.vm.synced_folder ".", "/vagrant", owner: "www-data", group: "www-data"

      node.vm.provision "setup", type: "shell", privileged: true, inline: <<-SHELL
        export DEBIAN_FRONTEND=noninteractive
        echo 'deb http://ftp.debian.org/debian stretch-backports main contrib non-free' > /etc/apt/sources.list.d/stretch-backports.list
        apt-get update
        apt-get upgrade -y
        apt-get install -y make vim wget htop screen rsync curl git bash-completion apt-transport-https ca-certificates software-properties-common unzip
        curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -
        add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable"
        apt-get update && apt-get install -y docker-ce=17.06.*
        curl -L https://github.com/docker/compose/releases/download/1.17.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        usermod -a -G docker,www-data vagrant
        service docker restart

        mkdir -p /opt/open-loyalty
        echo "cd /opt/open-loyalty" >> /home/vagrant/.bashrc
      SHELL

      node.vm.provision "sync", type: "shell", privileged: true, run: "always", inline: <<-SHELL
        rsync -av \
            --delete \
            --exclude ".git" \
            --exclude "frontend/node_modules" \
            --exclude "backend/var/cache/*" \
            --exclude "backend/var/logs/*" \
            --exclude "backend/var/sessions/*" \
            --exclude "backend/vendor" \
            /vagrant/ /opt/open-loyalty/

        chown -R www-data:www-data /opt/open-loyalty/

        sed -i  's/openloyalty.localhost/localhost:8181/g' /opt/open-loyalty/frontend/src/config.js

        echo ""
        echo "You can always sync files using:"
        echo "vagrant provision --provision-with sync"
        echo ""
      SHELL

      node.vm.provision "build", type: "shell", privileged: true, inline: <<-SHELL
        echo ""
        echo "You can always build base docker images using:"
        echo "vagrant provision --provision-with build"
        echo ""
      SHELL

      node.vm.provision "info", type: "shell", privileged: false, run: "always", inline: <<-SHELL
        echo ""
        echo "//------------------------------------------"
        echo "vagrant ssh (Login to vagrant using)"
        echo "docker-compose -f docker/docker-compose.yml up -d (Fetch & build containers - may take a while)"
        echo "docker-compose -f docker/docker-compose.yml exec php phing demo (Installing databases & demo data. It may take more than 10 minutes)"
        echo "docker-compose -f docker/docker-compose.yml logs --tail=100 -f (shows logs in real-time)"
        echo "docker system prune -f (removes not used docker images, containers etc.)"
        echo "//------------------------------------------"
        echo "Than it's ready to use!"
        echo "http://localhost:8181/api - API"
        echo "http://localhost:8181/doc - API DOC"
        echo "http://localhost:8182/ - ADMIN"
        echo "http://localhost:8183/ - CUSTOMER"
        echo "http://localhost:8184/ - MERCHANT"

        echo ""
      SHELL
  end
end

