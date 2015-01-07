host = "localhost"
deploy_folder = fetch(:deploy_folder)

server host, :app, :web, :db, :primary => true
set :deploy_to, "#{deploy_folder}"
set :branch, "dev-master" unless exists? :branch

load "#{stage_dir}/npm.rb"
