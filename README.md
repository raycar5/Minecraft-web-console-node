# Minecraft-web-console-node
a simple web console for minecraft servers

## LINUX ONLY  
(sorry)

If someone really needs a detailed tutorial on how to use it make an issue and I'll do it but basically:
* Edit config.json to specify the .sh that launches the server and the port
* Edit static/js/mine.js and put your server's ip in the first line
* Edit the minemgr file and place it in /etc/init.d (credit to [tchapi](https://github.com/fhd/init-script-template))
* Run the command sudo update-rc.d minemgr defaults
* Reboot
* Connect to the server via web browser
* Profit?
