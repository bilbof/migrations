secrets = YAML.load_file('config/secrets.yml')
user = secrets['capistrano_user']
ip_address = secrets['ip_address']

server ip_address, user: user, roles: %w{web app}

