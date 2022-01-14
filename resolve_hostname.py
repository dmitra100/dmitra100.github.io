import socket

with open("hostname.txt", "r") as r_file:
    with open("ip.txt", "w") as w_file:
        for hostname in r_file.readlines():
            hostname = hostname.strip()
            try:
                print ("Resolving:", hostname)
                ip = socket.gethostbyname(hostname)
                w_file.write(hostname + '-' + ip + '\n')
            except:
                print ("unable to resolve" + hostname)
