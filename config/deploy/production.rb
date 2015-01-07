host = "vm206.dnspropio.com"
deploy_folder = fetch(:deploy_folder)

server host, :app, :web, :db, :primary => true
set :deploy_to, "#{deploy_folder}"
set :branch, "master" unless exists? :branch

load "#{stage_dir}/npm.rb"
