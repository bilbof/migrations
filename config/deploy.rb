require 'yaml'
# Expected to be called from the root of the project
secrets = YAML.load_file('config/secrets.yml')
user = secrets['capistrano_user']
ip_address = secrets['ip_address']

# config valid for current version and patch releases of Capistrano
lock "~> 3.14.0"

set :application, "migration_stats_app"
set :repo_url, "git@github.com:bilbof/migrations.git"
set :deploy_via, :copy
set :copy_compression, :gzip
set :use_sudo, false
set :user, user
set :ssh_options, { :forward_agent => true }
role :web, ip_address
set :app_env, "production"
set :rbenv_path, "/home/#{user}/.rbenv"

# Ruby stuff
set :rbenv_type, :user # or :system, depends on your rbenv setup
set :rbenv_ruby, File.read('.ruby-version').strip
set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RAILS_ENV=production RACK_ENV=production RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
set :rbenv_map_bins, %w{rake gem bundle ruby rails}
set :rbenv_roles, :all # default value
append :linked_dirs, '.bundle'

# Foreman
set :foreman_use_sudo, false # Set to :rbenv for rbenv sudo, :rvm for rvmsudo or true for normal sudo
set :foreman_roles, :app
set :foreman_init_system, 'systemd'
# set :foreman_export_path, ->{ File.join(Dir.home, '.init') }
set :foreman_app, -> { "#{fetch(:application)}" }
set :foreman_app_name_systemd, -> { "#{ fetch(:foreman_app) }.target" }
set :foreman_log, -> { File.join(shared_path, 'log') }
set :foreman_port, 3002
set :foreman_export_path, "/home/#{user}/.config/systemd/user"

set :deploy_to, "/var/apps/#{fetch(:application)}"
set :foreman_env, "#{fetch(:deploy_to)}/current/config/foreman_env"
set :keep_releases, 2

namespace :deploy do
  desc "Check that we can access everything"
  task :check_write_permissions do
    on roles(:all) do |host|
      if test("[ -w #{fetch(:deploy_to)} ]")
        info "#{fetch(:deploy_to)} is writable on #{host}"
      else
        error "#{fetch(:deploy_to)} is not writable on #{host}"
      end
    end
  end

  task :run_yarn do
    on roles(:app) do
      execute "cd #{fetch(:deploy_to)}/current && npm install && npm run build"
    end
  end
end

before "deploy:published", "deploy:run_yarn"

# Default branch is :master
set :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure
