var vue = new Vue ({
	el : '.wrapper',
	data : {
    ID : 0,
    CPA : 0.00,
    encome : '0'
  },
  methods: {
      fetchData() {
	     	let uri = '/id';
		    if (parseInt(this.ID))
		    	axios.post(uri, { id : this.ID, myDate : $('#myDate').val() })
		      .then((response) => {
		      	if (response.data != '404') {
		      		days = response.data[0][2].toString();
			      	event_values = response.data[2];
			      	amount = response.data[1];
			      	graphDays();
			      	this.CPA = response.data[0][1] ? response.data[0][1].toFixed(2) : 0;
			      	this.encome = response.data[0][0];
		      	} else {
							initGraph(0, 0, 0, 0);
			      	this.CPA = 0;
			      	this.encome = '0';
		      	}
		      })
		      .catch((error) => {
		      	console.log(error);
		      });
		  }
   }
})