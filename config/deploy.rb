require "rubygems"
require 'capistrano/shared_file'

set :application,           "push-api"
set :repository,            "https://github.com/juandows/push-api.git"
set :scp,                   :git
set :deploy_via,            :rsync_with_remote_cache
set :user,                  "juande"
#set :ssh_options,           { :port => 1267 }

set :shared_files,          ["config/config.js"]
set :shared_children,       []

set :stages,                %w(production development)
set :default_stage,         "development"
set :stage_dir,             "config/deploy"

set :deploy_folder,         "/var/www/push_api"

require 'capistrano/ext/multistage'

set :use_sudo,              false
set :default_shell,         :bash

default_run_options[:pty] = true

after "deploy:restart", "deploy:cleanup"
