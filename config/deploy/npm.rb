after "deploy", "deploy:cleanup"
after "deploy:update_code", "npm:install"

namespace :npm do
  desc "Install dependences"
  task :install, :except => { :no_release => true } do
    run "if [ -d #{previous_release}/node_modules ]; then
            cp -a #{previous_release}/node_modules #{latest_release}/node_modules;
            cd #{latest_release} && npm install;
         else
            cd #{latest_release} && npm install;
         fi"
  end
end