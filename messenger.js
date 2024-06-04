//import Chart from 'chart.js/auto'

var datasets_data = []
var data_labels = []

const scales = {
  x: {
    position: 'bottom',
    type: 'time',
    time: {
      unit: 'second'
    },
    ticks: {
      source: 'labels',
      autoSkip: true,
      maxRotation: 90,
      minRotation: 90,
      maxTicksLimit: 10
    }
  },
  y: {
    position: 'left',
  },
};

ctx = document.getElementById("my_chart").getContext("2d");
my_chart = new Chart(ctx, 
    {
        type: 'line',
        data: {
            labels: data_labels,
            datasets: [
                {
                    label: 'Balance by Trade',
                    data: datasets_data,
                    borderColor: '#36A2EB',
                    backgroundColor: '#9BD0F5',
                }
            ]
        },
        options: {
            responsive: true,

            scales: scales,

            parsing: {
              xAxisKey: 'timestamp',
              yAxisKey: 'balance'
            },

            plugins: {
              zoom: {
                limits: {
                  //y: {min:'original',max: 'original'},
                  //x: {min:'original',max: 'original'}
                },
                zoom: {
                  wheel: {
                    enabled: true,
                    mode: 'xy'
                  },
                  pinch: {
                    enabled: true,
                    mode: 'xy'
                  },
                },
                pan: {
                  enabled: true,
                  mode: 'xy'
                },
              },
            }
        }
    }
);

Chart.defaults.backgroundColor = '#9BD0F5';
Chart.defaults.borderColor = '#36A2EB';
Chart.defaults.color = '#000';

function resetZoom() {
  my_chart.resetZoom();
}

window.addEventListener("DOMContentLoaded", () => {

    //const websocket = new WebSocket("ws://192.168.50.141:5678/");
    const websocket = new WebSocket("ws://localhost:5678/");
    websocket.onmessage = function(data) {
      arr_data = JSON.parse(data.data)
      var data_obj = process_received_messages(arr_data)
      try {
        data_labels.push(data_obj.timestamp)
        datasets_data.push(data_obj)
        my_chart.update()
      } catch (e) {
        console.log(e)
      }
    };

    websocket.onclose = function(event) {
      websocket.close(1000, "Work complete");
      event.code === 1000
      event.reason === "Work complete"
      event.wasClean === true
    };
  });
  
  function process_received_messages(data) {
      const arr_data = data.map(row => ({
        //timestamp: (row['time']),
        timestamp: (row['timestamp']),
        balance: (row['balance']),
        side: (row['side'])
      }));
      //Example data_obj: {timestamp: '2023-12-28 07:29:36.351481+00:00', balance: 42841.6, side: "SELL"}
      data_obj = {timestamp: arr_data[0].timestamp, balance: arr_data[0].balance, side: arr_data[0].side}
      return data_obj
  };