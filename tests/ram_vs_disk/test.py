import time
import requests
from matplotlib import pyplot as plt
from statistics import median, stdev

pods = {
    'SSD': 'http://localhost:3002/speedtest/',
    'RAM': 'http://localhost:3004/speedtest/',
}

FILES = ['1K.txt', '10K.txt', '100K.txt', '1M.txt', '10M.txt', '100M.txt', '1G.txt']
# FILES = ['1K.txt', '10K.txt', '100K.txt', '1M.txt', '10M.txt']

folder = 'files/'

averages = {}
medians  = {}
totals   = {}
raws     = {}

for p in pods.keys():
    # TODO add delta
    averages[p] = []
    medians[p]  = []
    totals[p]   = []
    raws[p]     = []

# diff = [ x-y for (x,y) in list(zip(averages['RAM'], averages['SSD']))]
# percent_of_max = lambda x, y:(x-y)/max(x,y)
# percent_diff = [ percent_of_max(x,y) for (x,y) in list(zip(averages['RAM'], averages['SSD']))]

def make_delta_graph(d1, d2, title='title'):
    global FILES
    percent_of_max = lambda x, y: (x-y)*100/max(x,y) # *100 to get percent
    percent_diff = [ percent_of_max(x,y) for (x,y) in list(zip(d1, d2))]
    _, ax = plt.subplots()
    ax.bar(FILES, percent_diff)
    # ax.set_yscale('log')
    # plt.legend(loc='upper left')
    plt.title(title)
    plt.show()

def unix_time_now():
    from subprocess import check_output
    return int(check_output(['date', '+%s']))


def make_bar_graph(data, title='graph'):
    global FILES
    _, ax = plt.subplots()
    for k, v in data.items():
        opacity = 1 / len(data)
        ax.bar(FILES, v, alpha=opacity, label=k)
        ax.set_yscale('log')
    plt.legend(loc='upper left')
    plt.title(title)
    plt.show()


def make_all_bar_graphs():
    for p in pods.keys():
        make_all_bar_graphs(averages[p], title='averages')
        make_all_bar_graphs(medians[p],  title='medians')
        make_all_bar_graphs(totals[p],   title='totals')


def print_stats(data, dataset):
    av = sum(data) / len(data)
    med = median(data)
    # standard_deviation = stdev(data)
    averages[dataset].append(av)
    medians[dataset].append(med)
    totals[dataset].append(sum(data))
    print('average: ', av)
    print('median: ', med)
    print('total: ', sum(data))

def time_to_get(url):
    start = time.process_time()
    response = requests.get(url)
    stop = time.process_time()
    return stop -start

def test(url, n, name=None):
    if not name:
        name = url
    print(f'testing {name}')
    ellapsed = []
    time_to_complet = []
    for _ in range(n):
        start = time.process_time()
        response = requests.get(url)
        stop = time.process_time()
        time_to_complet.append(stop - start)
        ellapsed.append(response.elapsed.microseconds)
    # print('ellapsed:')
    # print_stats(ellapsed)
    print('time_to_complet:')
    print_stats(time_to_complet, dataset=name)

def main():
    for f in FILES:
        for pod_name, pod_url in pods.items():
            n = 100
            print('\nTESTING: ', pod_name)
            print('f', f)
            print('start', f, unix_time_now())
            # print('pod_url', pod_url)
            # print('fetching: ', pod_url + folder + f)
            # print('batch of: ', n)
            test(pod_url + folder + f, n, name=pod_name)
            print('stop', f,  unix_time_now())

if __name__ == '__main__':
	main()
