import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
bind = "<ip address>:80"
