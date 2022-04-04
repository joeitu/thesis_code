mkdir -p files
tr -dc "A-Za-z0-9\n\r" < /dev/urandom | head -c 1000        > files/1K.txt
tr -dc "A-Za-z0-9\n\r" < /dev/urandom | head -c 10000       > files/10K.txt
tr -dc "A-Za-z0-9\n\r" < /dev/urandom | head -c 100000      > files/100K.txt
tr -dc "A-Za-z0-9\n\r" < /dev/urandom | head -c 1000000     > files/1M.txt
tr -dc "A-Za-z0-9\n\r" < /dev/urandom | head -c 10000000    > files/10M.txt
tr -dc "A-Za-z0-9\n\r" < /dev/urandom | head -c 100000000   > files/100M.txt
tr -dc "A-Za-z0-9\n\r" < /dev/urandom | head -c 1000000000  > files/1G.txt
