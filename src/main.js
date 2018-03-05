$(function() {

		$('input[name="daterange"]').daterangepicker(); // Календарь
		$('#myDate').on('apply.daterangepicker', () => {vue.fetchData()});

		initGraph();

});

// Алгоритм для работы с графикой
var days = '', 
	month = '', 
	myChart, 
	event_values = [],
	amount = [],
	numValues,
	numAmount;

function graphDays() {

	numValues = 0;
	numAmount = 0;


	if (days) {
		days = days.split('');
		var monthNum = parseInt(days.slice(4, 6).join(''));
		var feb = [];
		if (parseInt(days.slice(0, 4).join('')) % 4 === 0) {
			feb[0] = 29;
			feb[1] = 1;
		} else {
			feb[0] = 28;
			feb[1] = 2;
		}

		var day = parseInt(days.slice(6).join(''));
		if (day >= 30) {
			for (var i = 1; i <= 30; i++) {
				days[i-1] = day - 30 + i;
			}
			month = switchMonth(monthNum);
		}
		else {
			month = switchMonth(monthNum-1) + '/' + switchMonth(monthNum);
			switch (monthNum) {
				case  1:
				case  2:
				case  4:
				case  6:
				case  8:
				case  9:
				case 11: 
					for (var i = 1; i <= 30; i++) {
						days[i-1] = (day + 1 + i) % 31 === 0 ? 31 : (day + 1 + i) % 31;
					}
					break;
				case 3: 
					for (var i = 1; i <= 30; i++) {
						days[i-1] = (day + i - feb[1]) % feb[0] === 0 ? feb[0] : (day + i - feb[1]) % feb[0];
					}
					break;
				case 5:
				case 7:
				case 10:
				case 12:
					for (var i = 1; i <= 30; i++) {
						days[i-1] = (day + i) % 30 === 0 ? 30 : (day + i) % 30;
					}
					break;
			}
		}

		yInfo();
		initGraph(numAmount, numValues, event_values, amount);

		days = [];
		event_values = [];
		amount = [];
		vue.CPA = [];
		vue.encome = '0';
	}
}

function switchMonth(monthNum) {
	switch (monthNum) {
			case  1: return 'Январь'; 
			case  2: return 'Февраль'; 
			case  3: return 'Март'; 	
			case  4: return 'Апрель'; 
			case  5: return 'Май'; 		
			case  6: return 'Июнь';    
			case  7: return 'Июль';    
			case  8: return 'Август';  
			case  9: return 'Сентябрь';
			case 10: return 'Октябрь'; 
			case 11: return 'Ноябрь';
			case 0 :
			case 12: return 'Декабрь'; 
		}
}

// График
function initGraph(num1, num2, encomes, amounts) {
		  var ctx = $("#graph");
			
			if (myChart) myChart.destroy();
		  
		  myChart = new Chart(ctx, {
		    type: 'line',
		    data: {
		      labels: days,
		      datasets: [
		      {
		        label: 'Доход',
		        yAxisID: 'customers',
		        fill: false,
		        borderColor: "#7cc182",
		        pointBackgroundColor: "#7cc182",
		        pointHoverBorderColor: "#7cc182",
		        borderWidth: 3,
		        pointBorderWidth: 10,
		        pointRadius: 0,
		        pointHitRadius: 10,
		        lineTension: 0,
		        borderCapStyle: "square",
		        borderDash: [10],
		        data: encomes
		      },
		      {
		        label: 'Запросы',
		        yAxisID: 'place',
		        fill: false,
		        borderColor: "#fbdb00",
		        pointBackgroundColor: "#fbdb00",
		        pointHoverBorderColor: "#fbdb00",
		        borderWidth: 3,
		        pointBorderWidth: 10,
		        pointRadius: 0,
		        pointHitRadius: 10,
		        lineTension: 0,
		        borderCapStyle: "square",
		        borderDash: [10],
		        data: amounts
		      }]
		    },

		    options: {
		    	responsive: true,
		    	maintainAspectRatio: false,
		      legend: {
		        display: false
		      },
		      scales: {
		        xAxes: [{
		          ticks: {
		            fontColor: "#8592a7",
		            fontSize: 18,
		            fontFamily: "'dosis'"
		          },
		          gridLines: {
		            display: false,
		            color: "#8592a7",
		            lineWidth: 4

		          },
		          scaleLabel: {
		            display: true,
		            labelString: amounts ? month : '',
		            fontColor: "#8592a7",
		            fontSize: 20,
		            fontFamily: "'dosis'"
		          }
		        }],
		        yAxes: [{
		          id: "place",
		          position: "left",
		          stepSize: 50,
		          ticks: {
		            min: 0,
		            max: num1,
		            stepSize: num1 / 5,
		            fontColor: "#8592a7",
		            fontSize: 18,
		            fontFamily: "'dosis'"
		          },
		          gridLines: {
		            display: false,
		            color: "#8592a7",
		            lineWidth: 4,
		            drawTicks: true,
		            tickMarkLength: 15
		          },
		          scaleLabel: {
		            display: true,
		            labelString: "Запросы",
		            fontColor: "#8592a7",
		            fontSize: 20,
		            fontFamily: "'dosis'"
		          },
		        }, {
		          id: "customers",
		          position: "right",
		          gridLines: {
		            display: false,
		            color: "#8592a7",
		            lineWidth: 4
		          },
		          ticks: {
		            fontColor: "#8592a7",
		            fontSize: 18,
		            fontFamily: "'dosis'",
		            min: 0,
		            max: num2,
		            stepSize: num2 / 5
		          },
		          scaleLabel: {
		            display: true,
		            labelString: "Доход",
		            fontColor: "#8592a7",
		            fontSize: 20,
		            fontFamily: "'dosis'"
		          }
		        }]
		      }
		    }
		  });
}

function yInfo() {
	var fixed1 = (Math.max(...event_values) / 1000 + 1).toFixed(0);
	var fixed2 = (Math.max(...amount) / 500 + 1).toFixed(0);
	numValues = fixed1 * 1000;
	numAmount = fixed2 * 500;
} 